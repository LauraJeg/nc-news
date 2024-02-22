const { fetchArticleById, fetchArticles, updateVotes } = require("../models/articles-models");

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

exports.patchVotesByArticleId = (req,res,next) => {
    const {article_id} = req.params;
    const newVotes = req.body;
    Promise.all([fetchArticleById(article_id) ,updateVotes(newVotes, article_id)])
        .then((returnedPromises)=> {
            res.status(200).send({article: returnedPromises[1]})
        })
        .catch(next);
};

