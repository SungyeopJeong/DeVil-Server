const express = require("express");
const router = express.Router();
const request = require("request");
const db = require("../db/db")
require("dotenv").config()

function signUp(id, username, platform, res) {
  const sql = "INSERT INTO users VALUES (?, ?, ?)"
  db.query(sql, [id, username, platform], (err, _results) => {
    if (err) res.sendStatus(500);
    else res.status(200).send({id: id, username: username, platform: platform});
  })
}

function login(id, username, platform, res) {
  const sql = "SELECT * FROM users WHERE id = ? AND platform = ?";
  db.query(sql, [id, platform], (err, results) => {
    if (err) res.sendStatus(500);
    else if (results.length == 0) signUp(id, username, platform, res);
    else res.status(200).send({id: id, username: username, platform: platform});
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
        const name = JSON.parse(body).name;
        if (!name) res.sendStatus(401);
        login(id, name, "google", res);
      })
    }
  });
});

router.post("/kakao", async (req, res) => {
  request.get({
    url: process.env.AUTH_KAKAO_URL,
    headers: {
      Authorization: `Bearer ${req.body.token}`,
    },
  }, (_error, _response, body) => {
    const parsedBody = JSON.parse(body);
    const id = parsedBody.id;
    if (!id) res.sendStatus(401);
    else {
      login(id.toString(), parsedBody.properties.nickname, "kakao", res);
    }
  });
});

module.exports = router;
