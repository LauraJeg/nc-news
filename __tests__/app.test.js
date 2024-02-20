const app = require(`${__dirname}/../server/app.js`);
const request = require('supertest');
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
        .then((response) => {
          expect(response.body.topics.length).toBe(3);
          response.body.topics.forEach((topic) => {
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
      .then((response) => {
        expect(response.body.article.title).toBe("Living in the shadow of a great man");
        expect(response.body.article.topic).toBe("mitch");
        expect(response.body.article.author).toBe( "butter_bridge");
        expect(response.body.article.body).toBe( "I find this existence challenging");
        expect(response.body.article).toHaveProperty("created_at");
        expect(response.body.article.votes).toBe(100);
        expect(response.body.article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
      });
    });
    test('GET:404 sends an appropriate status and error message when given a valid but non-existent id', () => {
        return request(app)
          .get('/api/articles/999')
          .expect(404)
          .then((response) => {
            expect(response.body.msg).toBe('No article found for article_id: 999');
          });
      });
      test('GET:400 sends an appropriate status and error message when given an invalid id', () => {
        return request(app)
          .get('/api/articles/not-a-team')
          .expect(400)
          .then((response) => {
            expect(response.body.msg).toBe('Bad request');
          });
    });
});

// Consider what errors could occur with this endpoint, and make sure to test for them.