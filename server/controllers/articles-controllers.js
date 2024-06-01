const { fetchArticleById, removeArticle, fetchArticles, updateVotes, insertNewArticle } = require("../models/articles-models");
const { fetchTopics } = require("../models/topics-models");
const { fetchUsersByUsername } = require("../models/users-models");

exports.getArticleById = (req, res, next) => {

    const {article_id} = req.params;
    fetchArticleById(article_id).then((article)=> {
        res.status(200).send({article});
    })
    .catch(next);
};

exports.getArticles = (req,res,next)=> {
    const { topic, sort_by, order,  limit, p} = req.query;
    fetchArticles(topic, sort_by, order,  limit, p).then((articles)=> {
        res.status(200).send({articles, total_count: articles.length});
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
    //nested insertNewArticle due to concurrency issue
    Promise.all([fetchUsersByUsername(newArticle.author), fetchTopics()])
        .then(([errUser, errTopics])=> {
            let topicExists = false;
            errTopics.forEach(topic => {
                if(topic.slug === newArticle.topic) topicExists = true
            });
            if(topicExists === false){
                return Promise.reject({ 
                    status: 404, 
                    msg: `No topic found for topic: ${newArticle.topic}` });
            }
        })
        .then(()=>
            insertNewArticle(newArticle)
                .then((article)=> {
                    article.comment_count = 0;
                    res.status(201).send({ article})
                
                })
                .catch(next))
        .catch(next);

        
}

exports.deleteArticleById = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleById(article_id)
      .then(() => {
        return removeArticle(article_id);
      })
      .then(() => {
        res.status(204).send();
      })
      .catch(next);
  };

