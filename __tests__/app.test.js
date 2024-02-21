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
          .get('/api/articles/not-a-team')
          .expect(400)
          .then(({body}) => {
            expect(body.msg).toBe('Bad request');
          });
    });
});

describe('/api.articles', () => {
    test("GET:200 responds with an object describing all available articles, ordered by most recent post", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toBeSortedBy('created_at', {
                descending: true,
                coerce: true
              });
              expect(articles.length).toBe(13);
            for (const key in articles) {
              expect(articles[key]).toHaveProperty("author");
              expect(articles[key]).toHaveProperty("title");
              expect(articles[key]).toHaveProperty("article_id");
              expect(articles[key]).toHaveProperty("topic");
              expect(articles[key]).toHaveProperty("created_at");
              expect(articles[key]).toHaveProperty("votes");
              expect(articles[key]).toHaveProperty("article_img_url");
              expect(articles[key]).not.toHaveProperty("body");
              expect(articles[key]).toHaveProperty("comment_count");
              if(articles[key].article_id === 1) {
                expect(articles[key].comment_count).toBe('11');};
            };
          });
      });
});
describe('/api/articles/:article_id/comments', () => {
    test.only('GET:200 sends an object containing the article related to the id to the client, ordered by lastest posting', () => {
        return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({body}) => {
        const { comments } = body;
        expect(comments).toBeSortedBy('created_at', {
            descending: true,
            coerce: true
          });
        for (const key in comments) {
            expect(comments[key]).toHaveProperty("comment_id");
            expect(comments[key]).toHaveProperty("votes");
            expect(comments[key]).toHaveProperty("created_at");
            expect(comments[key]).toHaveProperty("author");
            expect(comments[key]).toHaveProperty("body");
            expect(comments[key]).toHaveProperty("article_id");
          };
        });
      });
    });
    test('GET: 204 returns an empty array when a valid article is passed that does not have any associated comments', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(204)
        .then(({body}) => {
          const { comments } = body;
          expect(comments.length).toBe(0);
        });
    });
    test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
          .get('/api/articles/999/comments')
          .expect(404)
          .then(({body}) => {
            expect(body.msg).toBe('No comments found for article_id: 999');
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



// Should:

// be available on /api/articles/:article_id/comments.
// get all comments for an article.
// Responds with:

// an array of comments for the given article_id of which each comment should have the following properties:
// comment_id
// votes
// created_at
// author
// body
// article_id
// Comments should be served with the most recent comments first.

// Consider what errors could occur with this endpoint, and make sure to test for them.

// Remember to add a description of this endpoint to your /api endpoint.