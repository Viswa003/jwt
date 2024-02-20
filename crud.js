const express = require("express");
const mysql = require("mysql2");
const bodyparser = require("body-parser");
const app = express();
const port = 8000;


const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "viswa",
});


connection.connect((err) => {
  if (err) {
    console.error("Error connecting to Mysql:", err);
    return;
  }
  console.log("Connected to MySQL");
});


app.use(bodyparser.json());
app.get("/getAllstudent1entsInfo", (req, res) => {
  connection.query("select * from student1", (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


app.get("/getAllstudent1Info/:id", (req, res) => {
  const stdId = req.params.id;
  connection.query("select * from student1 where id=?", [stdId], (err, results) => {
    if (err) throw err;
    res.json(results[0]);
  });
});


app.post("/addNewstudent1", (req, res) => {
  const { id, name, age, percentage } = req.body;
  connection.query("INSERT INTO student1 (id,name,age,percentage) VALUES (?,?,?,?)", [id, name, age, percentage], (err, results) => {
      if (err) throw err;
      res.json({ id: results.insertId, name, age, percentage });
    }
  );
});


app.put("/updatestudent1/:id", (req, res) => {
  const {id, name, age, percentage } = req.body;
  connection.query("UPDATE student1 SET name = ? , age = ? , percentage = ? WHERE id = ?",[name, age, percentage, id],
    (err) => {
      if (err) throw err;
      res.json({ id, name, age, percentage });
    });
});


app.delete("/removestudent/:id", (req, res) => {
  const stdId = req.params.id;
  connection.query("DELETE FROM student1 WHERE id=?", [stdId], (err) => {
    if (err) throw err;
    res.json({ message: "student1 deleted successfully", id: stdId });
  });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});