const { retrieveTopics, selectArticleById } = require("../model/topic-model")
const fs = require("fs/promises")

exports.getTopics = (req, res, next) => {
  retrieveTopics()
    .then((topics) => {
      res.status(200).send({ topics })
    })
    .catch(next)
}

exports.getEndPoints = (req, res, next) => {
  fs.readFile(`${__dirname}/../endpoints.json`)
    .then((endpointsData) => {
      const endpoints = JSON.parse(endpointsData)
      // console.log(endpoints, " end points")
      res.status(200).send({ endpoints })
    })
    .catch((error) => {
      console.error("Error in getEndPoints:", error)
      next(error)
    })
}

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params
  const parsedArticleId = parseInt(article_id)

  if (isNaN(parsedArticleId)) {
    return res.status(400).json({ msg: "Invalid article ID" })
  }

  selectArticleById(parsedArticleId)
    .then((article) => {
      if (!article) {
        // article not found, send 404 response
        return res.status(404).json({ msg: "Article not found" })
      }

      res.status(200).send({ article })
    })
    .catch(next)
}
