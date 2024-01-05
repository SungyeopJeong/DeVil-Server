const express = require("express");
const router = express.Router();
const axios = require('axios')

router.post("/google", async (req, res) => {
    var token = req.body.token;
    const url = "https://www.googleapis.com/oauth2/v2/userinfo"
    const resp = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    res.json(resp.data)
});

module.exports = router