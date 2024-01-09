const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.post("/studies", (req, res) => {
    const id = req.body.id;

    if (!id) res.sendStatus(400);
    else {
        const sql = "SELECT id, name, category, description, count(userid) as now, max, " +
            "case when creatorid = ? then true else false end as canDelete " +
            "FROM studies left outer join userstudy on studyid = id " +
            "WHERE id in (SELECT studyid FROM userstudy WHERE userid = ?) group by id";

        db.query(sql, [id, id], (err, result) => {
            if (err) res.sendStatus(500);
            else res.status(200).send(result);
        });
    }
});

module.exports = router;
