const { fetchArticleById, fetchArticles, fetchComments } = require("../models/artciles-modules");

exports.getArticleById = (req, res, next) => {

    const {article_id} = req.params;
    fetchArticleById(article_id).then((article)=> {
        res.status(200).send({article});
    })
    .catch(next);
};

exports.getArticles = (req,res,next)=> {
    fetchArticles().then((articles)=> {
        res.status(200).send({articles});
    });
};

exports.getCommentsByArticleId = (req,res,next) => {
    const {article_id} = req.params;
    fetchComments(article_id).then((comments)=> {
        res.status(200).send({comments});
    });
};