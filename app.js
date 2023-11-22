const express = require("express")
const {
  getTopics,
  getEndPoints,
  getArticleById,
} = require("./controller/controller")

const app = express()
app.use(express.json())

app.get("/api/topics", getTopics)
app.get("/api", getEndPoints)
app.get("/api/articles/:article_id", getArticleById)

// error 404
app.use((req, res, next) => {
  console.log("404 error middleware triggered")
  res.status(404).send({ msg: "not found" })
})

// error 500
// app.use((err, req, res, next) => {
//   console.log(err, "500 error")
//   res.status(500).send({ msg: "internal error" })
// })

module.exports = { app }
