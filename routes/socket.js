const express = require("express");
const router = express.Router();
const db = require("../db/db");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (data) => {
    console.log("Received message:", data);

    const insertQuery =
      "INSERT INTO studychat (userid, studyid, content, timestamp) VALUES (?, ?, ?, ?)";
    const values = [data.userid, data.studyid, data.content, data.timestamp];

    db.query(insertQuery, values, (insertErr, result) => {
      if (insertErr) {
        console.error("Error inserting data into MySQL:", insertErr);
      } else {
        console.log("Data inserted into MySQL");
      }
    });

    io.emit("response", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

module.exports = server;
