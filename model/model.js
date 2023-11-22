const db = require("../db/connection")
exports.retrieveTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows
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
