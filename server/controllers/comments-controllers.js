
const { fetchArticleById } = require("../models/articles-modules");
const { fetchComments, insertNewComment } = require("../models/comments-modules");

exports.getCommentsByArticleId = (req,res,next) => {
    const {article_id} = req.params;
    return Promise.all([
        fetchComments(article_id),
        fetchArticleById(article_id),
      ])
        .then((returnedPromises) => {

          if(returnedPromises[0].length === 0) res.status(204).send({ comments: 'There are no comments related to this article' })
          res.status(200).send({ comments: returnedPromises[0] });
        })
        .catch(next);
};

exports.postNewComment = (req,res,next)=> {
    const newComment = req.body;
    const {article_id} = req.params;
    return Promise.all([
        fetchArticleById(article_id),
        insertNewComment(newComment, article_id)
      ])
        .then((returnedPromises) => {
          res.status(201).send({ comment: returnedPromises[1] });
        })
        .catch(next);
};