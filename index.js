const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const db = require("../DeVil-Server/db/db");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// 로그인 페이지 렌더링
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/view/login.html");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // MySQL 쿼리 실행
  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error("MySQL 오류:", err.message);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }

    if (results.length > 0) {
      // 로그인 성공
      res.send("로그인 성공!");
    } else {
      // 로그인 실패
      res.send("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  });
});

app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
