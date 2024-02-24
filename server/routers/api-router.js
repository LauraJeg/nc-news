const { getEndpoints } = require('../controllers/endpoint-controller');
const topicsRouter = require('./topics-router');

const apiRouter = require('express').Router()

apiRouter.get('/', getEndpoints);

apiRouter.use('/topics', topicsRouter);

module.exports = apiRouter