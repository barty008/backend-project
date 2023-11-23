const fs = require("fs/promises")
const {
  retrieveTopics,
  selectArticleById,
  selectAllArticles,
  selectComments,
} = require("../model/model")

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
    return res.status(400).json({ msg: "Bad request - Invalid article ID" })
  }

  selectArticleById(parsedArticleId)
    .then((article) => {
      if (!article) {
        // article not found, send 404 response
        return res.status(404).json({ msg: "Not found - Article not found" })
      }

      res.status(200).send({ article })
    })
    .catch(next)
}

exports.getAllArticles = (req, res, next) => {
  // call model
  selectAllArticles()
    .then((articles) => {
      res.status(200).send({ articles })
      // console.log(articles, "<--articles===")
    })
    .catch(next)
}
// comments

exports.getComments = (req, res, next) => {
  const { article_id } = req.params

  const promises = [selectComments(article_id), checkArticleExists(article_id)]
  Promise.all(promises)
    .then(([comments, _]) => {
      res.status(200).send({ comments })
    })
    .catch(next)
}
