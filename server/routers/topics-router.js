const { getTopics } = require("../controllers/topics-controllers");
const apiRouter = require("./api-router");

const topicsRouter = require('express').Router()

topicsRouter.get('/', getTopics);

module.exports = topicsRouter
