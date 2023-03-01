const express = require("express")
const cors = require("cors")
const app = express()
const apiRouter = require("./routes/index.js")

app.use(cors())
app.use(express.json())
app.use("/api/courses", apiRouter)

module.exports = app;