require("dotenv").config()
const mysql = require("mysql")

const db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
})

const getCourses = (req, res) => {
  const { filterKey, filterValue, sortParams, page, limit } = req.query
  const filterBy = filterKey === "" ? null : filterKey
  const filterVal = filterValue === "" ? null : filterValue
  const params = JSON.parse(sortParams)

  // Calculate the offset and limit values based on the page and limit parameters
  const offset = (page - 1) * limit
  const sqlLimit = `LIMIT ${limit} OFFSET ${offset}`

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
  sql += ` ${sqlLimit}`

  db.query(sql,
    (err, result) => {
      if (err) {
        console.log(err)
        res.status(500).json({ error: err.message })
      } else {
        res.status(200).json({ message: "Courses retrieved successfully", result })
      }
    })
}

const createCourse = (req, res) => {
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
}

const editCourse = (req, res) => {
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
}

const deleteCourse = (req, res) => {
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
}

module.exports = {
  getCourses,
  createCourse,
  editCourse,
  deleteCourse
}