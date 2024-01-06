const express = require("express");
const router = express.Router();
const request = require("request");
require("dotenv").config()

function login(id) {

}

router.post("/google", (req, res) => {
  request.get({
    url: process.env.AUTH_GOOGLE_URL,
    qs: { access_token: req.body.token },
  }, (_error, _response, body) => {
    const id = JSON.parse(body).sub;
    if (!id) res.sendStatus(401);
    else {
      login(id);
      res.sendStatus(200);
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
    const id = JSON.parse(body).id;
    if (!id) res.sendStatus(401);
    else {
      login(id.toString());
      res.sendStatus(200);
    }
  });
});

module.exports = router;
