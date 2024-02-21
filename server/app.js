const express = require('express');
const { getTopics } = require('./controllers/topics-controllers');
const { getEndpoints } = require('./controllers/endpoint-controller');
const { getArticleById, getArticles} = require('./controllers/articles-controllers');
const { getCommentsByArticleId } = require('./controllers/comments-controllers');
const app = express();

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleById);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.all('/*', (req, res, next)=> {
    res.status(404).send({msg: 'Path not found'});
  });

app.use((err, req, res, next) => {
    if(err.status && err.msg) res.status(err.status).send({msg: err.msg});
    if(err.code = 23502) res.status(400).send({msg:'Bad request'});
    res.status(500).send({ msg: 'internal server error' });
})
module.exports = app;