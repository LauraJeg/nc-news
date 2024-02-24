const { getArticles, getArticleById, patchVotesByArticleId } = require('../controllers/articles-controllers');
const { getCommentsByArticleId, postNewComment } = require('../controllers/comments-controllers');

const articlesRouter = require('express').Router();

articlesRouter.get('/', getArticles);

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchVotesByArticleId);

articlesRouter
    .route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postNewComment);

module.exports = articlesRouter;