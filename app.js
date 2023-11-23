const express = require("express")
const {
  getTopics,
  getEndPoints,
  getArticleById,
  getAllArticles,
  getComments,
  addCommentToArticle,
} = require("./controller/controller")

const customError = (status, msg) => ({ status, msg })

const error404 = (req, res, next) => {
  const customErrorMessage = "Not Found"
  res.status(404).send(customError(404, customErrorMessage))
}

const pgError = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ status: 400, msg: "Bad Request" })
  } else {
    next(err)
  }
}

const serverError = (err, req, res, next) => {
  // console.log(err)
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
app.post("/api/articles/:article_id/comments", addCommentToArticle)
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
