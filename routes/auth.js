const express = require("express");
const router = express.Router();
<<<<<<< HEAD
var reqeust = require("request");

const kakao = {
  clientID: "1018476",
  clientSecret: "x8X0GCVPL4WUxiIVguCT5qz37hVcMvIP",
  redirectUrl: "http://localhost:3000/kakao",
  userInfoUrl: "https://kapi.kakao.com/v2/user/me",
};

router.post("/google", (req, res) => {
  var token = req.body.token;
  console.log(token);
  reqeust.get(
    {
      url:
        "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + token,
    },
    (_error, _response, body) => {
      res.json(JSON.parse(body));
    }
  );
});

router.post("/kakao", async (req, res) => {
  var token = req.body.token;
  console.log(token);
  request.get(
    {
      url: kakao.userInfoUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    (error, _response, body) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      const userInfo = JSON.parse(body);
      console.log(userInfo);
      res.json(userInfo);
    }
  );
});

module.exports = router;
=======
const axios = require("axios");

router.post("/google", async (req, res) => {
    var token = req.body.token;
    console.log(token);
    const url = "https://www.googleapis.com/oauth2/v2/userinfo";
    try {
        const resp = await axios.get(url, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        res.json(resp.data);
    } catch (error) {
        res.sendStatus(401);
    }
});

router.post("/kakao", (req, res) => {
    var token = req.body.token;
    console.log(token);
    res.sendStatus(200);
});

module.exports = router;
>>>>>>> main
