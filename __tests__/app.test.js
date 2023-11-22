const request = require("supertest")
const { app } = require("../app")
const seed = require("../db/seeds/seed")
const db = require("../db/connection")
const testData = require("../db/data/test-data")
//
const fs = require("fs/promises")
beforeAll(() => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((fileData) => {
      endpointsData = JSON.parse(fileData)
    })
})

//
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
  test("GET article with invalid ID should return 400", () => {
    return request(app).get("/api/articles/notanumber").expect(400)
  })

  test("GET non-existent article should return 404", () => {
    return request(app).get("/api/articles/9999").expect(404)
  })
})
