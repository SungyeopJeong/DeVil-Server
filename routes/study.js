const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/", (_req, res) => {
  db.query(
    "SELECT id, name, category, description, count(userid) AS now, max " +
      "FROM studies LEFT OUTER JOIN userstudy ON studyid = id GROUP BY id ORDER BY id DESC",
    (err, result) => {
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
    }
  );
});

function join(userid, studyid, res) {
  const sql = "INSERT INTO userstudy (userid, studyid) VALUES (?, ?)";

  db.query(sql, [userid, studyid], (err, _results) => {
    if (err) res.sendStatus(500);
    else res.sendStatus(201);
  });
}

router.post("/join", (req, res) => {
  const { userid, studyid } = req.body;

  if (!userid || !studyid) res.sendStatus(400);
  else join(userid, studyid, res);
});

//스터디 추가
router.post("/", (req, res) => {
  const { name, category, description, max, creatorid } = req.body;

  if (!name || !category || !description || !max || !creatorid) {
    res.status(400).send("Study name and description are required.");
    return;
  }

  const insertQuery =
    "INSERT INTO studies (name, category, description, max, creatorid) VALUES (?, ?, ?, ?, ?)";
  const values = [name, category, description, max, creatorid];

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error("MySQL 오류:", err.message);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }

    join(creatorid, result.insertId, res);
  });
});

//스터디 추가 정보 불러오기
//스터디에 가입한 사람들 정보를 불러옴. username, iscreator(만든사람항목에는 1), isme(지금 접속한 userid인지)
router.post("/:id", (req, res) => {
  const studyId = req.params.id;
  const userId = req.body.id;

  if (!studyId) {
    res.status(400).send("Study ID is required.");
    return;
  }

  const subQuery =
    "SELECT userid, CASE WHEN creatorId = userid THEN TRUE ELSE FALSE END AS iscreator " +
    "FROM studies JOIN userstudy ON id = studyid WHERE id = ?";
  const selectQuery =
    "SELECT username, iscreator, CASE WHEN userid = ? THEN TRUE ELSE FALSE END AS isme " +
    `FROM (${subQuery}) AS joinlist JOIN users ON id = userid`;
  const values = [userId, studyId];

  db.query(selectQuery, values, (err, result) => {
    if (err) {
      console.error("MySQL 오류:", err.message);
      res.status(500).send("서버 오류가 발생했습니다.");
      return;
    }

    if (result.length > 0) {
      res.send(result);
    } else {
      res.status(404).send("해당 ID의 스터디를 찾을 수 없습니다.");
    }
  });
});

//분야별 스터디
router.get("/category/:category", (req, res) => {
  const category = req.params.category;

  if (!category) {
    res.status(400).send("Category is required.");
    return;
  }

  const selectByCategoryQuery =
    "SELECT id, name, category, description, max FROM studies WHERE category = ?";
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
router.delete("/:id", (req, res) => {
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

//스터디 수정
router.patch("/:id", (req, res) => {
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

module.exports = router;
