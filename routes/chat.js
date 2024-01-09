const express = require("express");
const router = express.Router();
const db = require("../db/db");
const socketIO = require("socket.io");
const http = require("http");

const server = http.createServer(express);
const io = socketIO(server);

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("chatUpdate", () => {
    io.emit("chatUpdate");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// router.post("/", (req, res) => {
//   const id = req.body.id;

//   if (!id) res.sendStatus(400);
//   else {
//     const sql =
//       "select username, studyid, content, timestamp, " +
//       "case when userid = ? then true else false end as ismine " +
//       "from studychat " +
//       "join users on users.id = userid " +
//       "where studyid in (SELECT studyid FROM userstudy WHERE userid = ?) " +
//       "order by studyid, timestamp, studychat.id";

//     db.query(sql, [id, id], (err, result) => {
//       console.log(err);
//       if (err) res.sendStatus(500);
//       else {
//         io.emit("chat update", result);
//         res.status(200).send(result);
//       }
//     });
//   }
// });

router.post("/", async (req, res) => {
  try {
    const id = req.body.id;

    if (!id) {
      res.sendStatus(400);
      return;
    }

    const sql =
      "select username, studyid, content, timestamp, " +
      "case when userid = ? then true else false end as ismine " +
      "from studychat " +
      "join users on users.id = userid " +
      "where studyid in (SELECT studyid FROM userstudy WHERE userid = ?) " +
      "order by studyid, timestamp, studychat.id";

    const result = await new Promise((resolve, reject) => {
      db.query(sql, [id, id], (err, result) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    res.status(200).send(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = { router };
