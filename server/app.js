const express = require('express');
const { getTopics } = require('./controllers/topics-controllers');
const { getEndpoints } = require('./controllers/endpoint-controller');
const app = express();

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.all('/*', (req, res, next)=> {
    res.status(404).send({msg: 'Path not found'})
  });

app.use((err, req, res, next) => {
res.status(500).send({ msg: 'internal server error' })
})
module.exports = app;