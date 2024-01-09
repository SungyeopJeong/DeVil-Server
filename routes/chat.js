const express = require("express");
const router = express.Router();
const db = require("../db/db");
const socketIO = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

router.post("/", (req, res) => {
  const id = req.body.id;

  if (!id) res.sendStatus(400);
  else {
    const sql =
      "select username, studyid, content, timestamp, " +
      "case when userid = ? then true else false end as ismine " +
      "from studychat " +
      "join users on users.id = userid " +
      "where studyid in (SELECT studyid FROM userstudy WHERE userid = ?) " +
      "order by studyid, timestamp, studychat.id";

    db.query(sql, [id, id], (err, result) => {
      if (err) {
        res.sendStatus(500);
        console.log(err);
      } else {
        io.emit("chat update", result);
        res.status(200).send(result);
      }
    });
  }
});

module.exports = { router, io };
