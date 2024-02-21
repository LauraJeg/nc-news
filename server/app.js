const express = require('express');
const { getTopics } = require('./controllers/topics-controllers');
const { getEndpoints } = require('./controllers/endpoint-controller');
const { getArticleById, getArticles} = require('./controllers/articles-controllers');
const { getCommentsByArticleId, postNewComment } = require('./controllers/comments-controllers');
const { customErrors, psqlErrors, serverErrors } = require('./controllers/error-controllers');
const app = express();
app.use(express.json());

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postNewComment)

app.all('/*', (req, res, next)=> {
    res.status(404).send({msg: 'Path not found'});
  });
  app.use(customErrors);
  app.use(psqlErrors);
  app.use(serverErrors);
// app.use((err, req, res, next) => {
//     if(err.status && err.msg) res.status(err.status).send({msg: err.msg});
//     if(err.code === 23502 || err.code === '22P02'|| err.code === '23503') res.status(400).send({msg:'Bad request'});

//     res.status(500).send({ msg: 'internal server error' });
// })
module.exports = app;

 // test('GET: 204 returns an empty array when a valid article is passed that does not have any associated comments', () => {
    //     return request(app)
    //     .get('/api/articles/2/comments')
    //     .expect(204)
    //     .then(({body}) => {
    //       const { comments } = body;
    //       expect(comments.length).toBe(0);
    //     });
    // });

    //need some help on getting this to work, extremely confused