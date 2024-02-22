const app = require(`${__dirname}/../server/app.js`);
const request = require('supertest');
const comments = require('../db/data/test-data/comments');
const db = require(`${__dirname}/../db/connection.js`);
const seed = require(`${__dirname}/../db/seeds/seed.js`);
const data = require(`${__dirname}/../db/data/test-data/index.js`)

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('inputted path that does not exist', () => {
    it('should return 404 sends an appropriate error message', () => {
        return request(app)
        .get('/api/bannana')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('Path not found');
        });
    });
});

describe("/api", () => {
    test("GET:200 responds with an object describing all available endpoints", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          const { endpoints } = body;
          for (const key in endpoints) {
            expect(endpoints[key]).toHaveProperty("description");
            expect(endpoints[key]).toHaveProperty("queries");
            expect(endpoints[key]).toHaveProperty("exampleResponse");
          }
        });
    });
  });

describe('/api/topics', () => {
    test('GET:200 sends an array of topics to the client', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body}) => {
          expect(body.topics.length).toBe(3);
          body.topics.forEach((topic) => {
            expect(typeof topic.slug).toBe('string');
            expect(typeof topic.description).toBe('string');
          });
        });
    });
});

describe('/api/articles/:article_id', () => {
    test('GET:200 sends an object containing the article related to the id to the client', () => {
      return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({body}) => {
        expect(body.article.title).toBe("Living in the shadow of a great man");
        expect(body.article.topic).toBe("mitch");
        expect(body.article.author).toBe( "butter_bridge");
        expect(body.article.body).toBe( "I find this existence challenging");
        expect(body.article).toHaveProperty("created_at");
        expect(body.article.votes).toBe(100);
        expect(body.article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
      });
    });
    test("GET:200 responce includes a comment_count property", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: {article} }) => {
          expect(article).toHaveProperty("comment_count");
          expect(article.comment_count).toBe(11);
        });
    });
    test("GET:200 responce includes a comment_count property with value 0 when no comments are associated with the article", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body: {article} }) => {
          expect(article).toHaveProperty("comment_count");
          expect(article.comment_count).toBe(0);
        });
    });
    test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
          .get('/api/articles/999')
          .expect(404)
          .then(({body}) => {
            expect(body.msg).toBe('No article found for article_id: 999');
          });
      });
      test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
          .get('/api/articles/not-an-article')
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe('Bad request');
          });
    });
    describe("PATCH requests", () => {
      test("PATCH 200: responds with correctly updated article", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -30 })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toMatchObject({
              author: "butter_bridge",
              title: "Living in the shadow of a great man",
              article_id: 1,
              body: "I find this existence challenging",
              topic: "mitch",
              created_at: expect.any(String),
              votes: 70,
              article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            });
          });
      });
      test("PATCH 400: responds with appropriate status and error message when request has invalid content passed through", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "four" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
    });
      test("PATCH 404: sends an appropriate status and error message when given a valid but non-existent id", () => {
        return request(app)
          .patch("/api/articles/999")
          .send({ inc_votes: -20 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('No article found for article_id: 999');
          });
      });
      test("PATCH 400: responds with correct status and error message when requesting an invalid ID", () => {
        return request(app)
          .patch("/api/articles/not-an-article")
          .send({ inc_votes: -20 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
      test("PATCH 400: responds with appropriate status and error message when request has missing fields", () => {
        return request(app)
          .patch("/api/articles/5")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
});

describe('/api/articles', () => {
  describe('GET', () => {
    test("GET:200 responds with an object describing all available articles, ordered by most recent post", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: {articles} }) => {
            expect(articles).toBeSortedBy('created_at', {
                descending: true,
                coerce: true
              });
              expect(articles[0].comment_count).toBe("2")
              expect(articles.length).toBe(13);
              articles.forEach((article) => {
                expect(article).toMatchObject({
                  title: expect.any(String),
                  created_at: expect.any(String),
                  author: expect.any(String),
                  article_id:  expect.any(Number),
                  topic: expect.any(String),
                  article_img_url: expect.any(String),
                  comment_count: expect.any(String)
                });
                expect(article).not.toHaveProperty("body");
              });
          });
      });
      test('GET:200 should take a topic query which filters the articles by the topic value specified in the query.', () => {
        return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: {articles}}) => {
          expect(articles.length).toBe(12);
          articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
      });
      test.only("GET:200 when given topic query that exists, but has no associated articles", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body: {articles} }) => {
            expect(articles).toEqual([]);
          });
      });
      test("GET:404  sends an appropriate status and error message when given a valid but non-existent id", () => {
        return request(app)
          .get("/api/articles?topic=climbing")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("No articles found for topic: climbing");
          });
      });
    });
});
describe('/api/articles/:article_id/comments', () => {
  describe('GET', () => {
    test('GET:200 sends an object containing the article related to the id to the client, ordered by lastest posting', () => {
        return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({body}) => {
        const { comments } = body;
        expect(comments).toBeSortedBy('created_at', {
            descending: true,
            coerce: true
          });
          expect(comments.length).toBe(11);
          comments.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id:  expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              article_id:  expect.any(Number)
            });
            expect(comment).toHaveProperty("body");
          });
        });
      });
    test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
          .get('/api/articles/999/comments')
          .expect(404)
          .then(({body}) => {
            expect(body.msg).toBe('No article found for article_id: 999');
          });
      });
      test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
          .get('/api/articles/not-an-article/comments')
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe('Bad request');
          });
    });
    test('GET: 204 returns an empty array when a valid article is passed that does not have any associated comments', () => {
      return request(app)
      .get('/api/articles/2/comments')
      .expect(204)
      .then(({body}) => {
        expect(body).toEqual({});
      });
    });
  });
    describe('POST', () => {
      test('POST: 201 inserts new comment and returns comment to client', () => {
          const newComment = {
              username: 'butter_bridge',
              body: 'new comment'
          };
          return request(app)
          .post('/api/articles/2/comments')
          .send(newComment)
          .expect(201)
          .then(({body: {comment}}) => {
            expect(comment).toMatchObject({
              comment_id: 19,
              author: 'butter_bridge',
              votes: 0,
              article_id: 2,
              body: 'new comment',
              created_at: expect.any(String)
            });
          });
      });
      test("POST 400: responds with appropriate status and error message when request has invalid content", () => {
          return request(app)
            .post("/api/articles/5/comments")
            .send({
              username: "Simon",
              body: 12789041
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request");
            });
        });
        test("POST 404: sends an appropriate status and error message when given a valid but non-existent id", () => {
          return request(app)
            .post("/api/articles/999/comments")
            .send({
              username: "Mashca",
              body: "New article is great!"
            })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("No article found for article_id: 999");
            });
        });
        test("POST 400: sends an appropriate status and error message when given an invalid id", () => {
          return request(app)
            .get("/api/articles/not-an-article/comments")
            .send({
              username: "Mashca",
              body: "New article is great!"
            })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad request");
            });
        });
    });
});
describe('/api/comments/:comment_id', () => {
  describe('DELETE', () => {
    test("DELETE:204 deletes the specified comment and does not respond with a body", () => {
      return request(app).delete("/api/comments/4").expect(204);
    });
    test("DELETE:404 sends an appropriate status and error message when given a valid but non-existent id", () => {
      return request(app)
        .delete("/api/comments/999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No comment found for comment_id: 999");
        });
    });
    test("DELETE:400 sends an appropriate status and error message when given an invalid id", () => {
      return request(app)
        .delete("/api/comments/not-a-comment")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET requests", () => {
    test("GET: 200 responds with an array of all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users.length).toBe(4);
          users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            });
          });
        });
    });
  });
});
// CORE: GET /api/articles/:article_id (comment_count)
// Description

// FEATURE REQUEST An article response object should also now include:

//     comment_count, which is the total count of all the comments with this article_id. You should make use of queries to the database in order to achieve this.
