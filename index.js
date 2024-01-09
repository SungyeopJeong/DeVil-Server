const express = require("express");
const bodyParser = require("body-parser");
const authRouter = require("./routes/auth");
const studyRouter = require("./routes/study");
const userRouter = require("./routes/user");
const db = require("./db/db");

const app = express();
const port = 3000;

const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("get", (data) => {
    const id = data;

    if (!id) io.emit("init", { "statusCode": 400 });
    else {
      const sql =
        "select username, studyid, content, timestamp, " +
        //"case when userid = ? then true else false end as ismine " +
        "userid " +
        "from studychat " +
        "join users on users.id = userid " +
        "where studyid in (SELECT studyid FROM userstudy WHERE userid = ?) " +
        "order by studyid, timestamp, studychat.id";

      db.query(sql, [id, id], (err, result) => {
        if (err) {
          io.emit("init", { "statusCode": 500 });
        } else {
          io.emit("init", { "statusCode": 200, "body": result });
        }
      });
    }
  });

  socket.on("send", (data) => {
    console.log("Received message:", data);

    const insertQuery =
      "INSERT INTO studychat (userid, studyid, content) VALUES (?, ?, ?)";
    const values = [data.userid, data.studyid, data.content];

    db.query(insertQuery, values, (insertErr, result) => {
      if (insertErr) {
        console.error("Error inserting data into MySQL:", insertErr);
      } else {
        console.log("Data inserted into MySQL");
        const query = "select username, studyid, content, timestamp, " +
          "userid " +
          "from studychat " +
          "join users on users.id = userid " +
          "where studychat.id = ? ";
        db.query(query, [result.insertId], (err, result) => {
          if (!err) io.emit("study0", result[0]);
        });
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/auth", authRouter);
app.use("/api/study", studyRouter);
app.use("/api/user", userRouter);

// 메인 라우터
app.get("/", (_req, res) => {
  res.send("Welcome to your app!");
});

server.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
