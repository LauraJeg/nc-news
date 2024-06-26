const { getArticles, getArticleById,deleteArticleById, patchVotesByArticleId, postNewArticle } = require('../controllers/articles-controllers');
const { getCommentsByArticleId, postNewComment } = require('../controllers/comments-controllers');

const articlesRouter = require('express').Router();

articlesRouter
    .route('/')
    .get(getArticles)
    .post(postNewArticle);

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchVotesByArticleId)
    .delete(deleteArticleById);

articlesRouter
    .route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postNewComment);

module.exports = articlesRouter;