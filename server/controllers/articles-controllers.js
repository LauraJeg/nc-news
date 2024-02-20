const { fetchArticleById } = require("../models/artciles-modules");

exports.getArticleById = (req, res, next) => {

    const {article_id} = req.params
    fetchArticleById(article_id).then((article)=> {
        res.status(200).send({article})
    })
};