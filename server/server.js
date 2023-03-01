const app = require("./app")
const port = process.env.PORT || 3001

app.listen(port, err => {
  if (err) {
    return console.log("ERROR", err)
  }
  console.log(`course-manager app listening at http://localhost:${port}`)
})