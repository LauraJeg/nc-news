
const { fetchArticleById } = require("../models/articles-models");
const { fetchComments, insertNewComment, removeComment, updateVotesInComment } = require("../models/comments-models");

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
    //nested .then because of concurrency problems with Promise.all.
    fetchArticleById(article_id).then(()=> {
      return insertNewComment(newComment, article_id)
      .then((comment)=> {
        res.status(201).send({ comment});
      }).catch(next);
    })
    .catch(next);
};

exports.deleteComment = (req, res, next)=> {
  const {comment_id} = req.params;
  removeComment(comment_id)
  .then(()=> {
    res.status(204).send();
  })
  .catch(next);
};

exports.patchComment = (req, res, next) => {
  const {comment_id} = req.params;
  const newVotes = req.body;
  updateVotesInComment(newVotes, comment_id).then((comment)=> {
    res.status(200).send({comment});
  })
};