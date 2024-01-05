//mysql code

const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "172.10.7.56",
  user: "seunghyo",
  password: "1234",
  database: "testDB",
  port: 80,
});

connection.connect((err) => {
  if (err) {
    console.error("MySQL 연결 오류:", err.message);
    throw err;
  }
  console.log("MySQL에 성공적으로 연결되었습니다.");
});

module.exports = connection;
