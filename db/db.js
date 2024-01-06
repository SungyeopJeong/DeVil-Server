//mysql code

const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.error("MySQL 연결 오류:", err.message);
    throw err;
  }
  console.log("MySQL에 성공적으로 연결되었습니다.");
});

module.exports = connection;
