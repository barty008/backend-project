const db = require("../db/connection")
exports.retrieveTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows
  })
}
// get the article by id
exports.selectArticleById = (article_id) => {
  // select all columns from articles where article_id matches the provided parameter
  const queryArticles = `
    SELECT *
    FROM articles
    WHERE article_id = $1
  `

  // set up an array with the provided article_id
  const queryArrayValue = [article_id]

  // execute the database query
  return db.query(queryArticles, queryArrayValue).then(({ rows }) => {
    // if no rows are returned, reject the promise with a 404 status and "not found" message
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "not found" })
    } else {
      // if rows are returned, resolve the promise with the first row from the result set

      return rows[0]
    }
  })
}
