const express = require("express");
const bodyParser = require("body-parser");
const authRouter = require("./routes/auth");
const studyRouter = require("./routes/study");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

const app = express();
const port = 3000;

const server = require("http").createServer(app);
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("chat message", ({ userid, studyid, content, timestamp }) => {
    const query =
      "INSERT INTO studychat (userid, studyid, content, timestamp) VALUES (?, ?, ? ,? )";
    const values = [userid, studyid, content, timestamp];

    db.query(query, values, (err, results) => {
      if (err) throw err;

      // 저장된 메시지의 ID를 다시 가져와서 클라이언트에게 전송
      const messageId = results.insertId;
      io.emit("chat message", { id: messageId, userid, content, timestamp });
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
app.use("/api/chat", chatRouter.router);

// 메인 라우터
app.get("/", (_req, res) => {
  res.send("Welcome to your app!");
});

server.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
