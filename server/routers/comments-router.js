const { deleteComment, patchComment, getCommentById } = require('../controllers/comments-controllers');

const commentsRouter = require('express').Router();

commentsRouter
    .route('/:comment_id')
    .delete(deleteComment)
    .patch(patchComment)
    .get(getCommentById);

module.exports = commentsRouter;