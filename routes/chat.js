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
            "where studyid in (SELECT studyid FROM userstudy WHERE userid = ?) " +
            "order by studyid, timestamp, studychat.id";

        db.query(sql, [id, id], (err, result) => {
            console.log(err);
            if (err) res.sendStatus(500);
            else res.status(200).send(result);
        });
    }
});

module.exports = router;
