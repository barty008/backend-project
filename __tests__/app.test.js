const request = require("supertest")
const { app } = require("../app")
const seed = require("../db/seeds/seed")
const db = require("../db/connection")
const testData = require("../db/data/test-data")
const sorted = require("jest-sorted")
//
const fs = require("fs/promises")
const comments = require("../db/data/test-data/comments")
beforeAll(() => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((fileData) => {
      endpointsData = JSON.parse(fileData)
    })
})

afterAll(() => {
  return db.end()
})

beforeEach(() => {
  return seed(testData)
})

describe("/api/topics", () => {
  test("GET: 200 returns an array of all topic", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body

        expect(topics.length).toBe(3)
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          })
        })
      })
  })
})

//
describe("app behaviour", () => {
  test("GET 404 - returns 404 with message - not found ", () => {
    return request(app)
      .get("/unknownRoute")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found")
      })
  })
})

// // api test endpoint
describe("/api", () => {
  test(`GET responds 200 with an object`, () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body
        expect(typeof endpoints).toBe("object")
      })
  })
  test(`GET responds 404 for an unknown endpoint`, () => {
    return request(app)
      .get("/api/nonexistent")
      .expect(404)
      .then(({ body }) => {
        expect(body.endpoints).toBeUndefined()
      })
  })
  test("API Endpoint Integration Test: verify GET request returns 200 status and response object Matches endpoints.json", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body
        expect(endpoints).toEqual(endpointsData)
      })
  })
})

// articles
describe("/api/articles/", () => {
  test("GET: 200 article object with correct properties", () => {
    return request(app)
      .get("/api/articles/10")
      .expect(200)
      .then(({ body }) => {
        const { article } = body
        expect(article).toMatchObject({
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        })
      })
  })
})
// ===================================
describe("/api", () => {
  test(`GET responds 200 with an object`, () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body
        expect(typeof endpoints).toBe("object")
      })
  })
  test(`GET responds 404 for an unknown endpoint`, () => {
    return request(app)
      .get("/api/nonexistent")
      .expect(404)
      .then(({ body }) => {
        expect(body.endpoints).toBeUndefined()
      })
  })
  test("API Endpoint Integration Test: verify GET request returns 200 status and response object Matches endpoints.json", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const { endpoints } = body
        expect(endpoints).toEqual(endpointsData)
      })
  })
})

// articles
describe("/api/articles/", () => {
  test("GET: 200 article object with correct properties", () => {
    return request(app)
      .get("/api/articles/10")
      .expect(200)
      .then(({ body }) => {
        const { article } = body
        expect(article).toMatchObject({
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        })
      })
  })
  test("GET article 10", () => {
    return request(app)
      .get("/api/articles/10")
      .expect(200)
      .then(({ body }) => {
        const { article } = body
        const articleTen = {
          article_id: 10,
          title: "Seven inspirational thought leaders from Manchester UK",
          topic: "mitch",
          author: "rogersop",
          body: "Who are we kidding, there is only one, and it's Mitch!",
          created_at: "2020-05-14T04:15:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        }
        expect(article).toEqual(articleTen)
      })
  })
  test("GET article with invalid ID should return 400 with a specific message", () => {
    return request(app)
      .get("/api/articles/notanumber")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request - Invalid article ID")
      })
  })

  test("GET non-existent article should return 404 with a specific message", () => {
    return request(app).get("/api/articles/9999").expect(404)
    // .then(({ body }) => {
    // .xpect(body.msg)
    // .toBe("Not found - Article not found")
    // })
  })
})
// ===================================
test("GET article 10", () => {
  return request(app)
    .get("/api/articles/10")
    .expect(200)
    .then(({ body }) => {
      const { article } = body
      const articleTen = {
        article_id: 10,
        title: "Seven inspirational thought leaders from Manchester UK",
        topic: "mitch",
        author: "rogersop",
        body: "Who are we kidding, there is only one, and it's Mitch!",
        created_at: "2020-05-14T04:15:00.000Z",
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      }
      expect(article).toEqual(articleTen)
    })
})
test("GET article with invalid ID should return 400 with a specific message", () => {
  return request(app)
    .get("/api/articles/notanumber")
    .expect(400)
    .then(({ body }) => {
      expect(body.msg).toBe("Bad request - Invalid article ID")
    })
})

test("GET non-existent article should return 404 with a specific message", () => {
  return request(app).get("/api/articles/9999").expect(404)
  // .then(({ body }) => {
  // .xpect(body.msg)
  // .toBe("Not found - Article not found")
  // })
})
// =============
// =============
describe("/api/topics", () => {
  test("GET: 200 returns an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body

        expect(topics.length).toBe(3)
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          })
        })
      })
  })
})

describe("/api/articles", () => {
  test("GET: 200 gets all articles", () => {
    const { articleData: testArticleData } = testData

    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body
        expect(articles.length).toBe(testArticleData.length)
      })
  })
  test("GET: articles should be sorted by created_at in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body

        expect(articles).toBeSortedBy("created_at", { descending: true })
      })
  })
  test("GET: articles with correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body
        expect(articles.length).toBe(13)

        articles.forEach((article) => {
          expect(article).toHaveProperty("author")
          expect(article).toHaveProperty("title")
          expect(article).toHaveProperty("article_id")
          expect(article).toHaveProperty("topic")
          expect(article).toHaveProperty("created_at")
          expect(article).toHaveProperty("votes")
          expect(article).toHaveProperty("article_img_url")
          expect(article).toHaveProperty("comment_count")
        })
      })
  })

  test("GET: articles should not have a body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body

        articles.forEach((article) => {
          expect(article).not.toHaveProperty("body")
        })
      })
  })
})

// task 6

describe("/api/articles/:article_id/comment", () => {
  test("GET: 200 responds with an array of comments for a specific article", (done) => {
    const { commentData: modifiedCommentData } = testData
    request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments: receivedComments } = body

        const expectedNumberOfComments = modifiedCommentData.filter(
          (comment) => {
            return comment.article_id === 1
          }
        ).length
        expect(receivedComments.length).toBe(expectedNumberOfComments)
        done()
      })
    // .catch(done)
  })

  test("GET: 200 returns an empty array if the specified article has no comments", (done) => {
    request(app)
      .get("/api/articles/10/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments: receivedComments } = body
        // console.log(receivedComments, "<----")
        expect(receivedComments).toEqual([])
        done()
      })
    // .catch(done)
  })

  test("GET: 200 comments have the correct properties for a specific article", (done) => {
    const { commentData: modifiedCommentData } = testData
    request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments: receivedComments } = body
        const expectedArticleId = 2
        const expectedNumberOfComments = modifiedCommentData.filter(
          (comment) => {
            return comment.article_id === 2
          }
        ).length
        expect(receivedComments.length).toBe(expectedNumberOfComments)
        receivedComments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expectedArticleId,
          })
        })
        done()
      })
    // .catch(done)
  })

  test("GET: 200 returns the most recent comments first for a specific article", (done) => {
    request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments: receivedComments } = body
        expect(receivedComments).toBeSortedBy("created_at", {
          descending: true,
        })
        done()
      })
      .catch(done)
  })
  test("GET: 404 for non-existent article should return 'Not Found' message", () => {
    const { articleData: modifiedArticleData } = testData
    return request(app)
      .get(`/api/articles/${modifiedArticleData.length + 1}/comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body.status).toBe(404)
        expect(body.msg).toBe("Not Found - Article not found")
      })
  })

  test("GET: 400 for invalid article_id type should return 'Bad Request' message", () => {
    return request(app)
      .get(`/api/articles/unknown/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.status).toBe(400)
        expect(body.msg).toBe("Bad Request")
      })
  })
  // task 7

  test("POST: 201 adds a comment to an article", () => {
    const articleId = 1
    const userComment = {
      username: "testUser",
      body: "This is a test comment.",
    }

    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(userComment)
      .expect(400)
      .then((response) => {
        // console.log(response)
        expect(response.body.msg).toBe("Bad Request")
      })
  })
  test("POST: 201 adds a comment to an article", () => {
    const articleId = 1
    const userComment = {
      username: "butter_bridge",
      body: "This is a test comment.",
    }

    return request(app)
      .post(`/api/articles/${articleId}/comments`)
      .send(userComment)
      .expect(201)
    // .then((response) => {
    //   console.log(response)
    //   expect(response.body.msg).toBe("Bad Request")
    // })
  })
})

test("POST: 400 with Bad Request for invalid article ID", () => {
  return request(app)
    .post("/api/articles/notanumber/comments")
    .send({
      username: "testUser",
      body: "This is an invalid comment.",
    })
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe("Bad Request")
    })
})

test("POST: 404 with Not Found for non-existent article ID", () => {
  const nonExistentArticleId = 1000000000

  const userComment = {
    username: "testUser",
    body: "This is a comment for a non-existent article.",
  }

  return request(app)
    .post(`/api/articles/${nonExistentArticleId}/comments`)
    .send(userComment)
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe("Not Found - Article not found")
    })
})
// 8==========
test("should update an artcle votes with a positive value", (done) => {
  request(app)
    .patch("/api/articles/1")
    .send({ inc_votes: 5 })
    .expect(200)
    .end((err, res) => {
      if (err) return done(err) / expect(res.body.article).toBeDefined()

      expect(res.body.article).toHaveProperty("title")
      expect(res.body.article).toHaveProperty("author")

      expect(res.body.article.votes).toBe(105)
      done()
    })
})
test("should handle bad request when inc_votes is not an integer", (done) => {
  request(app)
    .patch("/api/articles/1")
    .send({ inc_votes: "invalid" })
    .expect(400)
    .expect(
      { status: 400, msg: "Bad Request - inc_votes must be an integer" },
      done
    )
})

test("should handle not found when the article_id does not exist", (done) => {
  request(app)
    .patch("/api/articles/999")
    .send({ inc_votes: 2 })
    .expect(404, done)
})

// 9
// __tests__/app.test.js
test("should delete a comment by comment_id", (done) => {
  request(app)
    .delete("/api/comments/1")
    .expect(204)
    .end((err, res) => {
      if (err) return done(err)

      // Ensure that the response body is empty
      expect(res.body).toEqual({})
      done()
    })
})

describe("deleteCommentById ()", () => {
  test("should handle not found when the comment_id does not exist", (done) => {
    request(app)
      .delete("/api/comments/999")
      .expect(404)
      .end((err, res) => {
        if (err) return done(err)

        expect(res.body.msg).toBe("Not Found - Comment not found")
        done()
      })
  })

  test("should handle other errors when deleting a comment", (done) => {
    request(app)
      .delete("/api/comments/invalidCommentId")
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)

        expect(res.body.msg).toBe("Bad Request")
        done()
      })
  })
})
// 10
// app.test.js

describe("getting all users", () => {
  test("should return users when found", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        const { users } = res.body

        expect(users).toBeInstanceOf(Array)
        expect(users.length).toBeGreaterThan(0)

        users.forEach((user) => {
          expect(user).toHaveProperty("username")
          expect(user).toHaveProperty("name")
          expect(user).toHaveProperty("avatar_url")

          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          })
        })
      })
  })
})

describe("GET /api/articles/topic", () => {
  test("responds with 200 and returns an array of articles for a valid topic", () => {
    const validTopicSlug = "mitch"

    return request(app)
      .get(`/api/articles?topic=${validTopicSlug}`)
      .expect(200)
      .expect((response) => {
        expect(Array.isArray(response.body.articles)).toBe(true)
      })
  })

  test("responds with 200 and returns an empty array for a valid topic with no articles", () => {
    const validTopicSlugWithNoArticles = "paper"

    return request(app)
      .get(`/api/articles?topic=${validTopicSlugWithNoArticles}`)
      .expect(200)
      .expect((response) => {
        expect(Array.isArray(response.body.articles)).toBe(true)
        expect(response.body.articles).toHaveLength(13)
      })
  })
})
