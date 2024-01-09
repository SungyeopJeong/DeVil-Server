const express = require("express");
const bodyParser = require("body-parser");
const authRouter = require("./routes/auth");
const studyRouter = require("./routes/study");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const db = require("./db/db");

const app = express();
const port = 3000;

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

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/auth", authRouter);
app.use("/api/study", studyRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

// 메인 라우터
app.get("/", (_req, res) => {
  res.send("Welcome to your app!");
});

server.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
