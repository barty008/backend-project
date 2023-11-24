const db = require("../db/connection")
exports.retrieveTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows
  })
}
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

exports.selectAllArticles = () => {
  const queryString = `
  SELECT articles.author, articles.title, articles.article_id, articles.topic, 
         articles.created_at, articles.votes, articles.article_img_url,
         COUNT(comments.comment_id)::INTEGER as comment_count
  FROM articles
  LEFT JOIN comments USING (article_id)
  GROUP BY articles.article_id
  ORDER BY created_at DESC
  `
  return db.query(queryString).then(({ rows }) => {
    return rows
  })
}

exports.checkArticleExists = (article_id) => {
  return db
    .query(
      `
  SELECT *
  FROM articles
  WHERE article_id = $1
  `,
      [article_id]
    )
    .then(({ rows }) => {
      console.log(rows, "<----")
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" })
      }
    })
}

exports.checkArticleExists = (article_id) => {
  return db
    .query(
      `
  SELECT *
  FROM articles
  WHERE article_id = $1
  `,
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not Found" })
      }
    })
}

exports.selectComments = (article_id) => {
  const queryString = `
  SELECT comments.comment_id, comments.votes, comments.created_at,
         comments.author, comments.body, comments.article_id
  FROM comments
  JOIN articles USING (article_id)
  WHERE articles.article_id = $1
  ORDER BY comments.created_at DESC
  `
  return db.query(queryString, [article_id]).then(({ rows }) => {
    return rows
  })
}
// task 7
exports.addCommentToArticle = (articleId, userComment) => {
  const queryString = `
    INSERT INTO comments 
    (article_id, author, body)
    VALUES
    ($1, $2, $3)
    RETURNING *
  `
  const queryValues = [articleId, userComment.username, userComment.body]

  return db.query(queryString, queryValues).then(({ rows }) => {
    return rows[0]
  })
}
// 8
exports.updateArticleVotes = (article_id, inc_votes) => {
  const queryString = `
    UPDATE articles
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *
  `

  const queryValues = [inc_votes, article_id]

  // console.log("SQL Query:", queryString)
  console.log("Query Values:", queryValues)

  return db.query(queryString, queryValues).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        msg: "Not Found - Article not found",
      })
    }
    console.log("Updated Article:=========", rows[0])
    return rows[0]
  })
}
