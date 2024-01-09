const express = require("express");
const router = express.Router();
const request = require("request");
const db = require("../db/db");
require("dotenv").config();

function signUp(id, username, platform, profileUrl, res) {
  const sql = "INSERT INTO users VALUES (?, ?, ?)";
  db.query(sql, [id, username, platform], (err, _results) => {
    if (err) res.sendStatus(500);
    else res.status(201).send({
      id: id,
      username: username,
      platform: platform,
      profileUrl: profileUrl,
    });
  })
}

function login(id, username, platform, profileUrl, res) {
  const sql = "SELECT * FROM users WHERE id = ? AND platform = ?";
  db.query(sql, [id, platform], (err, results) => {
    if (err) res.sendStatus(500);
    else if (results.length == 0) signUp(id, username, platform, profileUrl, res);
    else res.status(200).send({
      id: id,
      username: username,
      platform: platform,
      profileUrl: profileUrl,
    });
  });
}

router.post("/google", (req, res) => {
  request.get({
    url: process.env.AUTH_GOOGLE_TOKEN_URL,
    qs: { access_token: req.body.token },
  }, (_error, _response, body) => {
    const parsedBody = JSON.parse(body);
    const id = parsedBody.sub;
    if (!id || parsedBody.aud != process.env.AUTH_GOOGLE_CLIENT_ID) res.sendStatus(401);
    else {
      request.get({
        url: process.env.AUTH_GOOGLE_USER_URL,
        qs: { access_token: req.body.token },
      }, (_error, _response, body) => {
        const parsedBody = JSON.parse(body);
        const name = parsedBody.name;
        if (!name) res.sendStatus(401);
        else login(id, name, "google", parsedBody.picture, res);
      })
    }
  });
});

router.post("/kakao", (req, res) => {
  request.get({
    url: process.env.AUTH_KAKAO_URL,
    headers: {
      Authorization: `Bearer ${req.body.token}`,
    },
  }, (_error, _response, body) => {
    const parsedBody = JSON.parse(body);
    const id = parsedBody.id;
    if (!id) res.sendStatus(401);
    else login(id.toString(), parsedBody.properties.nickname, "kakao", parsedBody.properties.thumbnail_image, res);
  });
});

router.delete("/signout", (req, res) => {
  const id = req.body.id;

  if (!id) res.sendStatus(400);
  else {
    const sql = "DELETE FROM users WHERE id = ?";

    db.query(sql, id, (err, result) => {
      if (err) res.sendStatus(500);
      else if (result.affectedRows > 0) res.sendStatus(200);
      else res.sendStatus(404);
    });
  }
});

module.exports = router;
