const express = require('express');
const app = express();
app.use(express.json());

const { deleteComment } = require('./controllers/comments-controllers');
const { customErrors, psqlErrors, serverErrors } = require('./controllers/error-controllers');
const { getUsers } = require('./controllers/users-controllers');
const apiRouter = require('./routers/api-router');

app.use('/api', apiRouter);

app.delete('/api/comments/:comment_id', deleteComment);

app.get('/api/users', getUsers);

app.all('/*', (req, res, next)=> {
    res.status(404).send({msg: 'Path not found'}); //change to error handling controller
  });
  app.use(customErrors);
  app.use(psqlErrors);
  app.use(serverErrors);

module.exports = app;
