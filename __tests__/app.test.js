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
  describe('GET', () => {
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
  describe('POST', ()=> {
    test("POST:201 responds with the same object", () => {
      const newTopic = {
        slug: "Dogs",
        description: "Doggy traits"
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(201)
        .then(({ body }) => {
          const { topic } = body;
          expect(topic).toMatchObject({
            slug: "Dogs",
            description: "Doggy traits"
          });
        });
    });
    test("POST:201 accepts request body without a description", () => {
      const newTopic = {
        slug: "Dogs",
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(201)
        .then(({ body }) => {
          const { topic } = body;
          expect(topic.slug).toBe("Dogs");
          expect(topic.description).toBe(null);
        });
    });
    test("POST:400 returns an error when body is missing slug field", () => {
      const newTopic = {
        description: "This is incorrect",
      };
      return request(app)
        .post("/api/topics")
        .send(newTopic)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  })
});

describe('/api/articles/:article_id', () => {
  describe('GET', () => {
    test('GET:200 sends an object containing the article related to the id to the client', () => {
      return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({body: {article}}) => {
        expect(article).toMatchObject({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: expect.any(String),
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
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
  })
   
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
  describe('DELETE', () => {
      test("DELETE:204 deletes article and does not send a body back", () => {
        return request(app).delete("/api/articles/5").expect(204);
      });

      test("DELETE:404 returns an error when a valid but non existent article_id is received", () => {
        return request(app)
        .delete("/api/articles/999")
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe('No article found for article_id: 999')
        })
      })
      test("DELETE:400 returns an error when an invalid article_id is received", () => {
        return request(app)
        .delete("/api/articles/notAnId")
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Bad request")
        })
      })
  })
});

describe('/api/articles', () => {
  describe('GET', () => {
    test("GET:200 responds with an object describing all available articles, ordered by most recent post", () => {
        return request(app)
          .get("/api/articles?limit=100")
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

      describe('topic', () => {
        test('GET:200 should take a topic query which filters the articles by the topic value specified in the query.', () => {
          return request(app)
          .get("/api/articles?topic=mitch&limit=100")
          .expect(200)
          .then(({ body: {articles}}) => {
            expect(articles.length).toBe(12);
            articles.forEach((article) => {
              expect(article.topic).toBe("mitch");
            });
          });
        });
        test("GET:200 when given topic query that exists, but has no associated articles", () => {
          return request(app)
            .get("/api/articles?topic=paper")
            .expect(200)
            .then(({ body: {articles} }) => {
              expect(articles).toEqual([]);
            });
        });
        test("GET:404  sends an appropriate status and error message when given a valid but non-existent topic", () => {
          return request(app)
            .get("/api/articles?topic=climbing")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("No articles found for topic: climbing");
            });
        });
      });

      describe('sort by', () => {
        test('GET:200 should take a sort_by query which sorts the articles by the category specified in the query.', () => {
          return request(app)
          .get("/api/articles?sort_by=title")
          .expect(200)
          .then(({ body: {articles}}) => {
            expect(articles).toBeSortedBy('title', {
              descending: true
            });
          });
          });
         test('GET:200 should take a sort_by query which sorts the articles by the category specified in the query.', () => {
          return request(app)
          .get("/api/articles?sort_by=comment_count")
          .expect(200)
          .then(({ body: {articles}}) => {
            expect(articles).toBeSortedBy('comment_count', {
              descending: true,
              coerce: true
            });
          });
          });
        
        test("GET:200 should sort by created_at as a default", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: {articles} }) => {
              expect(articles).toBeSortedBy('created_at', {
                descending: true,
              });
            });
        });
        test("GET:400 sends an appropriate status and error message when given an invalid category", () => {
          return request(app)
            .get("/api/articles?sort_by=errors")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad request");
            });
        });
      });
      describe('order by', ()=> {
        test('GET:200 should take a order query which orders the articles specified by the query.', () => {
          return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body: {articles}}) => {
            expect(articles).toBeSorted({
              descending: false,
            });
          });
        });
        test("GET:200 should have a descending order as a default", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body: {articles} }) => {
              expect(articles).toBeSorted({
                descending: true,
              });
            });
        });
        test("GET:400 sends an appropriate status and error message when given an invalid category", () => {
          return request(app)
            .get("/api/articles?order=errors")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad request");
            });
        });
      });
      describe('pagination', () => {
        test("GET:200 should respond with the number of articles limited by query", () => {
          return request(app)
            .get("/api/articles?limit=5")
            .expect(200)
            .then(({ body }) => {
              const { articles } = body;
              expect(articles.length).toBe(5);
            });
        });
        test("GET:200 when no limit query received, responds with 10 articles as default ", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              const { articles } = body;
              expect(articles.length).toBe(10);
            });
        });
        test("GET:200 responds with a default total_count property of 10", () => {
          return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
              expect(body.total_count).toBe(10);
            });
        });
        test("GET:200 responds with a total_count property of actual articles received", () => {
          return request(app)
            .get("/api/articles?topic=cats&limit=8")
            .expect(200)
            .then(({ body }) => {
              expect(body.total_count).toBe(1);
            });
        });
        test("GET:200 responds with the specified page", () => {
          return request(app)
            .get("/api/articles?sort_by=article_id&order=asc&limit=2&p=4")
            .expect(200)
            .then(({ body }) => {
              const { articles } = body;
              expect(articles[0].article_id).toBe(7);
              expect(articles[1].article_id).toBe(8);
            });
        });
      })
    });
    describe('POST', () => {
      test('POST: 201 inserts new article and returns article to client', () => {
        const newArticle = {
            author: 'butter_bridge',
            body: 'new article',
            topic: 'cats',
            title: 'A catty article',
            article_img_url: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fi.natgeofe.com%2Fn%2F548467d8-c5f1-4551-9f58-6817a8d2c45e%2FNationalGeographic_2572187_square.jpg&tbnid=eAP244UcF5wdYM&vet=12ahUKEwiAtf6yxtGEAxVZVaQEHT0bAMIQMygAegQIARBx..i&imgrefurl=https%3A%2F%2Fwww.nationalgeographic.com%2Fanimals%2Fmammals%2Ffacts%2Fdomestic-cat&docid=K6Qd9XWnQFQCoM&w=3072&h=3072&itg=1&q=cat&client=ubuntu-sn&ved=2ahUKEwiAtf6yxtGEAxVZVaQEHT0bAMIQMygAegQIARBx'
        };
        return request(app)
        .post('/api/articles')
        .send(newArticle)
        .expect(201)
        .then(({body: {article}}) => {
          expect(article).toMatchObject({
            article_id: 14,
            author: 'butter_bridge',
            body: 'new article',
            topic: 'cats',
            title: 'A catty article',
            article_img_url: 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fi.natgeofe.com%2Fn%2F548467d8-c5f1-4551-9f58-6817a8d2c45e%2FNationalGeographic_2572187_square.jpg&tbnid=eAP244UcF5wdYM&vet=12ahUKEwiAtf6yxtGEAxVZVaQEHT0bAMIQMygAegQIARBx..i&imgrefurl=https%3A%2F%2Fwww.nationalgeographic.com%2Fanimals%2Fmammals%2Ffacts%2Fdomestic-cat&docid=K6Qd9XWnQFQCoM&w=3072&h=3072&itg=1&q=cat&client=ubuntu-sn&ved=2ahUKEwiAtf6yxtGEAxVZVaQEHT0bAMIQMygAegQIARBx',
            created_at: expect.any(String),
            votes: 0,
            comment_count:0
          });
        });
    });
    test('POST: 201 adds default url when not included in the inserted article', () => {
      const newArticle = {
        author: 'butter_bridge',
        body: 'new article',
        topic: 'cats',
        title: 'A catty article'
    };
    return request(app)
    .post('/api/articles')
    .send(newArticle)
    .expect(201)
    .then(({body: {article}}) => {
      expect(article).toMatchObject({
        article_id: 14,
        author: 'butter_bridge',
        body: 'new article',
        topic: 'cats',
        title: 'A catty article',
        article_img_url: 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700',
        created_at: expect.any(String),
        votes: 0,
        comment_count:0
      });
    });
    });

      test("POST 404: sends an appropriate status and error message when given a non-existant topic", () => {
        return request(app)
          .post("/api/articles")
          .send({
            author: 'butter_bridge',
            body: 'new article',
            topic: 'dogs',
            title: 'A doggy article'
        })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("No topic found for topic: dogs");
          });
      });
      test("POST 404: sends an appropriate status and error message when given a non-existant user", () => {
        return request(app)
          .post("/api/articles")
          .send({
            author: 'zabito',
            body: 'new article',
            topic: 'cats',
            title: 'A catty article'
        })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("No user found for username: zabito");
          });
      });
      test("POST 400: responds with appropriate status and error message when request has missing fields", () => {
        return request(app)
          .post("/api/articles")
          .send({
            author: 'butter_bridge',
            body: 'new article',
            topic: 'cats'
          })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad request");
          });
      });
    })
});
describe('/api/articles/:article_id/comments', () => {
  describe('GET', () => {
    test('GET:200 sends an object containing the article related to the id to the client, ordered by lastest posting', () => {
        return request(app)
      .get('/api/articles/1/comments?limit=100')
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
    describe('Comments Pagination', () => {
      test("GET:200 responds with the number of comments requested", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=7")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(comments.length).toBe(7);
          });
      });
      test("GET:200 should give 10 comments per page as default", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(comments.length).toBe(10);
          });
      });
      test("GET:200 responds with the specified page", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=2&p=3")
          .expect(200)
          .then(({ body }) => {
            const { comments } = body;
            expect(comments.length).toBe(2);
            expect(comments[0].comment_id).toBe(6);
            expect(comments[1].comment_id).toBe(7);
          });
      });
      test("GET:400 sends an appropriate status and error message when given an invalid limit", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=notANumber")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
      test("GET:400 sends an appropriate status and error message when given an invalid page", () => {
        return request(app)
          .get("/api/articles/1/comments?p=notANumber")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
      test("GET:400 returns an error when p is not strictly a number to avoid SQL injection", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=3&p=2;")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
      test("GET:400 returns an error when limit is not strictly a number to avoid SQL injection", () => {
        return request(app)
          .get("/api/articles/1/comments?limit=5;")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
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
              // votes: 0,
              article_id: 2,
              body: 'new comment',
              created_at: expect.any(String)
            });
          });
      });
        test("POST 404: sends an appropriate status and error message when given a valid but non-existent id", () => {
          return request(app)
            .post("/api/articles/987/comments")
            .send({
              username: "butter_bridge",
              body: "New article is great!"
            })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe('No article found for article_id: 987');
            });
        });
        test("POST 400:  responds with appropriate status and error message when request has missing fields", () => {
          return request(app)
            .get("/api/articles/not-an-article/comments")
            .send({
              username: "butter_bridge",
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
  describe('GET', () => {
    test('GET:200 sends an object containing the comment related to the id to the client', () => {
      return request(app)
      .get('/api/comments/2')
      .expect(200)
      .then(({body: {comment}}) => {
        expect(comment).toMatchObject({
          body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          votes: 14,
          author: "butter_bridge",
          article_id: 1,
          created_at: expect.any(String),
        });
      });
    });
    test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
          .get('/api/comments/999')
          .expect(404)
          .then(({body}) => {
            expect(body.msg).toBe('No comment found for comment_id: 999');
          });
      });
      test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
          .get('/api/comments/not-a-comment')
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe('Bad request');
          });
    });
  });
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
  describe('PATCH requests', () => {
    test("PATCH 200: responds with updated comment", () => {
      return request(app)
        .patch("/api/comments/2")
        .send({ inc_votes: -1 })
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toMatchObject({
            body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
            votes: 13,
            author: "butter_bridge",
            article_id: 1,
            created_at: expect.any(String),
          });
        });
    });
    test("PATCH 404: sends an appropriate status and error message when given a valid but non-existent id", () => {
      return request(app)
        .patch("/api/comments/999")
        .send({ inc_votes: 40 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("No comment found for comment_id: 999");
        });
    });
    test("PATCH 400: sends an appropriate status and error message when given an invalid id", () => {
      return request(app)
        .patch("/api/comments/not-a-comment")
        .send({ inc_votes: 3 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    test("PATCH 400: responds with appropriate status and error message when request has missing fields", () => {
      return request(app)
        .patch("/api/comments/3")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
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

describe('/api/users/:username', () => {
  describe('GET', ()=> {
    test('GET:200 sends an object containing the user related to the username to the client', () => {
      return request(app)
      .get('/api/users/butter_bridge')
      .expect(200)
      .then(({body : {user}}) => {
        expect(user).toMatchObject({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
        });
      });
    });
    test("GET 404: responds with appropriate status and error message when username does not match in the database", () => {
      return request(app)
        .get("/api/users/pinkman")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("No user found for username: pinkman");
        });
    });
  });
});

