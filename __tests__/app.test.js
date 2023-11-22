const request = require("supertest")
const { app } = require("../app")
const seed = require("../db/seeds/seed")
const db = require("../db/connection")
const testData = require("../db/data/test-data")
const fs = require("fs/promises")

afterAll(() => {
  return db.end()
})

beforeEach(() => {
  return seed(testData)
})

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
const sorted = require("jest-sorted")
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

        const dateComparator = (a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        expect(articles).toBeSorted(dateComparator)
      })
  })
  // test("GET: all articles in the correct order", () => {
  //   const { articleData: testArticleData } = testData

  //   return request(app)
  //     .get("/api/articles")
  //     .expect(200)
  //     .then((response) => {
  //       const { articles } = response.body
  //       //  correct order logic
  //       for (let i = 0; i < articles.length - 1; i++) {
  //         // convert date strings into JS Date objects
  //         const currentDate = new Date(articles[i].created_at).getTime()
  //         const nextDate = new Date(articles[i + 1].created_at).getTime()
  //         // compare the two dates as numbers using getTime()
  //         expect(currentDate).toBeGreaterThanOrEqual(nextDate)
  //       }
  //     })
})
test("GET: articles with correct properties", () => {
  return request(app)
    .get("/api/articles")
    .expect(200)
    .then((response) => {
      const { articles } = response.body

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

// 1) check article properties have the properties:
// 2) should not have a body property
// send pr task 5 fixes
