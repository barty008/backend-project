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
