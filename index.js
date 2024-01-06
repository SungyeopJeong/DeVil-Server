const express = require("express");
const bodyParser = require("body-parser");
const authRouter = require("./routes/auth");
const studyRouter = require("./routes/study");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
