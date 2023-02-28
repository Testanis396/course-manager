require('dotenv').config()
const express = require("express")
const app = express()
const port = process.env.PORT || 3001
const mysql = require("mysql")
const cors = require("cors")

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})

app.get("/api/courses", (req, res) => {
  const { filterKey, filterValue, sortParams } = req.query
  const filterBy = filterKey === "" ? null : filterKey
  const filterVal = filterValue === "" ? null : filterValue
  const params = JSON.parse(sortParams)
  // query the database with the specified parameters
  let sql = "SELECT id, subject, number, name, credits, grade, DATE_FORMAT(date, '%Y-%m-%d') AS date FROM courses"
  if (filterBy && filterVal) {
    sql += ` WHERE ${filterBy} = ${db.escape(filterVal)}`
  }
  if (params[0].sortKey !== '' && params[0].sortOrder !== '') {
    // sortKey and sortOrder are defined
    sql += " ORDER BY "
    for (let i = 0; i < params.length; i++) {
      const { sortKey, sortOrder } = params[i]
      sql += `${sortKey} ${sortOrder}`
      if (i < params.length - 1) {
        sql += ", "
      }
    }
  }
  db.query(sql,
    (err, result) => {
      if (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
      } else {
        res.status(200).json({ message: "Courses retrieved successfully", result })
      }
    })
})

app.post('/api/create', (req, res) => {
  const formData = req.body
  db.query("INSERT INTO courses (subject, number, name, credits, grade, date) VALUES (?,?,?,?,?,?)",
    [
      formData.subject,
      formData.number,
      formData.name,
      formData.credits,
      formData.grade,
      formData.date
    ],
    (err, result) => {
      if (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
      }
      else {
        res.status(201).json({ message: "Course created successfully", id: result.insertId })
      }
    }
  )
})

app.put('/api/courses/:id', (req, res) => {
  const { id, subject, number, name, credits, grade, date } = req.body
  db.query("UPDATE courses SET subject = ?, number = ?, name = ?, credits = ?, grade = ?, date = ? WHERE id = ?",
    [subject, number, name, credits, grade, date, id],
    (err, result) => {
      if (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
      } else {
        res.status(200).json({ message: "Course updated successfully" })
      }
    }
  )
})

app.delete("/api/courses/:id", (req, res) => {
  const { id } = req.params
  db.query("DELETE FROM courses WHERE id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
      } else {
        res.status(204).json({ message: "Course deleted successfully" })
      }
    })
})

app.listen(port, err => {
  if (err) {
    return console.log("ERROR", err)
  }
  console.log(`simple-crud app listening at http://localhost:${port}`)
})