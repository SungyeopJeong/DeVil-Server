const express = require("express");
const router = express.Router();
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