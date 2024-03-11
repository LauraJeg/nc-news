const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());


const { customErrors, psqlErrors, serverErrors, invalidPath } = require('./controllers/error-controllers');
const apiRouter = require('./routers/api-router');

app.use('/api', apiRouter);


app.all('/*', invalidPath);
  app.use(customErrors);
  app.use(psqlErrors);
  app.use(serverErrors);

module.exports = app;