
const { fetchArticleById } = require("../models/articles-modules");
const { fetchComments, insertNewComment } = require("../models/comments-modules");

exports.getCommentsByArticleId = (req,res,next) => {
    const {article_id} = req.params;
    return Promise.all([
        fetchComments(article_id),
        fetchArticleById(article_id),
      ])
        .then((returnedPromises) => {
          res.status(200).send({ comments: returnedPromises[0] });
        })
        .catch(next);
};

exports.postNewComment = (req,res,next)=> {
    const newComment = req.body;
    const {article_id} = req.params;
    insertNewComment(newComment, article_id).then((comment)=>{
        res.status(201).send({ comment });
    })
};