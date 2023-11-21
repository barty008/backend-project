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
  console.log(req.params)

  selectArticleById(article_id)
    .then((article) => {
      console.log("Retrieved article:", article)
      res.status(200).send({ article })
    })
    .catch(next)
}
