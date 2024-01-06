const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.post("/", (req, res) => {
    const id = req.body.id;

    if (!id) res.sendStatus(400);
    else {
        const sql = "select username, studyid, content, timestamp, " +
            "case when userid = ? then true else false end as ismine " +
            "from studychat " +
            "join users on users.id = userid " +
            "order by studyid, timestamp";

        db.query(sql, id, (err, result) => {
            console.log(err);
            if (err) res.sendStatus(500);
            else res.status(200).send(result);
        });
    }
});

module.exports = router;
