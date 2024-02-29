const { fetchArticleById, fetchArticles, updateVotes, insertNewArticle } = require("../models/articles-models");

exports.getArticleById = (req, res, next) => {

    const {article_id} = req.params;
    fetchArticleById(article_id).then((article)=> {
        res.status(200).send({article});
    })
    .catch(next);
};

exports.getArticles = (req,res,next)=> {
    const { topic, sort_by, order} = req.query;
    fetchArticles(topic, sort_by, order).then((articles)=> {
        res.status(200).send({articles});
    })
    .catch(next);
};

exports.patchVotesByArticleId = (req,res,next) => {
    const {article_id} = req.params;
    const newVotes = req.body;
    Promise.all([fetchArticleById(article_id), updateVotes(newVotes, article_id)])
        .then(([article, updatedVotes])=> {
            res.status(200).send({article: updatedVotes})
        })
        .catch(next);
};

exports.postNewArticle = (req, res, next )=> {
    const newArticle = req.body;
    insertNewArticle(newArticle)
        .then((article)=> {
            article.comment_count = 0;
            res.status(201).send({ article});
        })
}

