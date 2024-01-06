const express = require("express");
const router = express.Router();
var reqeust = require("request")

router.post("/google", (req, res) => {
    var token = req.body.token;
    console.log(token);
    reqeust.get({ url: "https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + token }, (_error, _response, body) => {
        res.json(JSON.parse(body));
    })
});

module.exports = router