const express = require("express");
const bodyParser = require("body-parser");
const db = require("../DeVil-Server/db/db");
const authRouter = require("./routes/auth");

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api/auth", authRouter);

//study 전체 목록 조회
app.get("/study", (req, res) => {
  db.query("SELECT * FROM studies", (err, result) => {
    if (err) {
      console.error("MySQL 오류:", err.message);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }
    if (result.length > 0) {
      res.send(result);
    } else {
      res.send("data가 없습니다.");
    }
  });
});

//스터디 추가
app.post("/study", (req, res) => {
  const { name, category, description, max } = req.body;

  if (!name || !category || !description || !max) {
    res.status(400).send("Study name and description are required.");
    return;
  }

  const insertQuery =
    "INSERT INTO studies (name, category, description, max) VALUES (?, ?, ?, ?)";
  const values = [name, category, description, max];

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error("MySQL 오류:", err.message);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }

    res.status(201).send("스터디가 성공적으로 추가되었습니다.");
  });
});

//스터디 상세 정보 불러오기
app.get("/study/:id", (req, res) => {
  const studyId = req.params.id;

  if (!studyId) {
    res.status(400).send("Study ID is required.");
    return;
  }

  const selectQuery = "SELECT * FROM studies WHERE id = ?";
  const values = [studyId];

  db.query(selectQuery, values, (err, result) => {
    if (err) {
      console.error("MySQL 오류:", err.message);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }

    if (result.length > 0) {
      res.send(result[0]);
    } else {
      res.status(404).send("해당 ID의 스터디를 찾을 수 없습니다.");
    }
  });
});

//분야별 스터디
app.get("/study/category/:category", (req, res) => {
  const category = req.params.category;

  if (!category) {
    res.status(400).send("Category is required.");
    return;
  }

  const selectByCategoryQuery = "SELECT * FROM studies WHERE category = ?";
  const valuesByCategory = [category];

  db.query(selectByCategoryQuery, valuesByCategory, (err, result) => {
    if (err) {
      console.error("MySQL 오류:", err.message);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }

    if (result.length > 0) {
      res.send(result);
    } else {
      res.status(404).send("해당 카테고리의 스터디를 찾을 수 없습니다.");
    }
  });
});

//스터디 삭제
app.delete("/study/:id", (req, res) => {
  const studyId = req.params.id;

  if (!studyId) {
    res.status(400).send("Study ID is required.");
    return;
  }

  const deleteQuery = "DELETE FROM studies WHERE id = ?";
  const values = [studyId];

  db.query(deleteQuery, values, (err, result) => {
    if (err) {
      console.error("MySQL 오류:", err.message);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }

    if (result.affectedRows > 0) {
      res.send("스터디가 성공적으로 삭제되었습니다.");
    } else {
      res.status(404).send("해당 ID의 스터디를 찾을 수 없습니다.");
    }
  });
});

//스터다 수정
app.patch("/study/:id", (req, res) => {
  const studyId = req.params.id;
  const { name, category, description, max } = req.body;

  if (!studyId) {
    res.status(400).send("Study ID is required.");
    return;
  }

  const updateQuery =
    "UPDATE studies SET name = ?, category = ?, description = ?, max = ? WHERE id = ?";
  const values = [name, category, description, max, studyId];

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      console.error("MySQL 오류:", err.message);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }

    if (result.affectedRows > 0) {
      res.send("스터디 정보가 성공적으로 업데이트되었습니다.");
    } else {
      res.status(404).send("해당 ID의 스터디를 찾을 수 없습니다.");
    }
  });
});

// 메인 라우터
app.get("/", (req, res) => {
  res.send("Welcome to your app!");
});

app.listen(port, () => {
  console.log(`서버가 포트 ${port}에서 실행 중입니다.`);
});
