const { fetchArticleById } = require("../models/articles-modules");
const { fetchComments } = require("../models/comments-modules");

exports.getCommentsByArticleId = (req,res,next) => {
    const {article_id} = req.params;
    fetchComments(article_id)
        .then((comments) => {
          res.status(200).send({ comments});
        })
        .catch(next);
};
