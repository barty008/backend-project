const { retrieveTopics, selectAllArticles } = require("../model/model")

exports.getTopics = (req, res, next) => {
  retrieveTopics()
    .then((topics) => {
      res.status(200).send({ topics })
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
