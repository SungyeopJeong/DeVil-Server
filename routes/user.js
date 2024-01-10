const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.post("/studies", (req, res) => {
  const id = req.body.id;

  if (!id) res.sendStatus(400);
  else {
    const sql =
      "SELECT id, name, category, description, count(userid) AS now, max, " +
      "CASE WHEN creatorid = ? THEN TRUE ELSE FALSE END AS canDelete " +
      "FROM studies LEFT OUTER JOIN userstudy ON studyid = id " +
      "WHERE id IN (SELECT studyid FROM userstudy WHERE userid = ?) GROUP BY id ORDER BY MAX(createdtime) DESC";

    db.query(sql, [id, id], (err, result) => {
      if (err) res.sendStatus(500);
      else res.status(200).send(result);
    });
  }
});

module.exports = router;
