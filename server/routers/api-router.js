const articlesRouter = require('./articles-router');
const { getEndpoints } = require('../controllers/endpoint-controller');
const topicsRouter = require('./topics-router');

const apiRouter = require('express').Router();

apiRouter.get('/', getEndpoints);

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/articles', articlesRouter);

module.exports = apiRouter;