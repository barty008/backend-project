const express = require("express")
const { getTopics, getAllArticles } = require("./controller/controller")
const app = express()
app.use(express.json())

app.get("/api/topics", getTopics)
app.get("/api/articles", getAllArticles)
// error 404
app.use((req, res, next) => {
  res.status(404).send({ msg: "not found" })
})
// error 500
app.use((err, req, res, next) => {
  console.log(err, "500 error")
  res.status(500).send({ msg: "internal error" })
})

module.exports = { app }
