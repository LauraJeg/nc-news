const { getTopics, postTopics } = require("../controllers/topics-controllers");

const topicsRouter = require('express').Router();

topicsRouter
    .route('/')
    .get(getTopics)
    .post(postTopics);

module.exports = topicsRouter;
