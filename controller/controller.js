const fs = require("fs/promises")
const {
  retrieveTopics,
  selectArticleById,
  selectAllArticles,
  selectComments,
  checkArticleExists,
  insertArticleComment,
  addCommentToArticle,
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
// comments - two functions checking if it exists and getting the comments

exports.getComments = (req, res, next) => {
  // extracting the id from the request parameter
  const { article_id } = req.params
  //1 need to retrieve comments for the articleid
  // 2 need to check if the artile exists, create a funciton for this = needs to be in model
  const allPromises = [
    selectComments(article_id),
    checkArticleExists(article_id),
  ]
  Promise.all(allPromises)
    .then(([comments]) => {
      // console.log(comments, "<-------")
      res.status(200).send({ comments })
    })
    .catch(next)
}
// task 7
exports.addCommentToArticle = (request, response, next) => {
  const { articleId } = request.params
  const commentData = request.body

  if (!/^[0-9]+$/.test(articleId)) {
    next({ status: 400, msg: "Bad Request" })
  } else {
    checkArticleExistence(articleId)
      .then(() => {
        return addCommentToArticle(articleId, commentData)
      })
      .then((newComment) => {
        response.status(201).send({ newComment })
      })
      .catch(next)
  }
}
