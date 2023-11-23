const express = require("express")
const {
  getTopics,
  getEndPoints,
  getArticleById,
  getAllArticles,
  getComments,
} = require("./controller/controller")
const error404 = (req, res, next) => {
  res.status(404).send({ status: 404, msg: "Not Found" })
}

const pgError = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ status: 400, msg: "Bad Request" })
  } else {
    next(err)
  }
}

const serverError = (err, req, res, next) => {
  console.log(err)
  if (err.status) {
    res.status(err.status).send({ status: err.status, msg: err.msg })
  } else {
    res.status(500).send({ msg: "Internal Server Error" })
  }
}

const app = express()
app.use(express.json())

app.get("/api/topics", getTopics)
app.get("/api", getEndPoints)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles/:article_id/comments", getComments)

app.get("/api/articles", getAllArticles)

app.use((req, res, next) => {
  console.log("404 error middleware triggered")
  res.status(404).send({ msg: "not found" })
})

// handle all the routes of 404 errors
app.all("*", error404)
// middleware to handle pg errors
app.use(pgError)
// for server errors
app.use(serverError)

module.exports = { app }
