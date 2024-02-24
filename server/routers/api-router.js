const { getEndpoints } = require('../controllers/endpoint-controller');

const apiRouter = require('express').Router()

apiRouter.get('/', getEndpoints);

module.exports = apiRouter