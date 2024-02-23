const { fetchTopics } = require("./topics-models");

const db = require(`${__dirname}/../../db/connection.js`);

exports.fetchArticleById = (article_id) => {
    return db
    .query( `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count
    FROM articles 
    LEFT JOIN comments USING (article_id)
    WHERE article_id = $1
    GROUP BY articles.article_id`, [article_id])
    .then((result) => {
        const article = result.rows[0];
        if(!article) {
        return Promise.reject({
            status: 404,
            msg: `No article found for article_id: ${article_id}`,
          })};
        return article;
    });
};

exports.fetchArticles = (topic, sort_by = "created_at")=> {
    const queryVals = [];
    let strQuery = `SELECT article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id) as comment_count FROM comments
    RIGHT JOIN articles USING (article_id)`;
    const validSortBy = ["article_id", "title", "author", "created_at", "votes", "body", "article_img_url", "topic", 'comment_count'];

    if(topic){
        queryVals.push(topic);
        strQuery += ` WHERE topic = $1`;
    };

    if(!validSortBy.includes(sort_by)){
        return Promise.reject({
            status: 400,
            msg: `Bad request`
          });
    };
    strQuery += `GROUP BY article_id
    ORDER BY ${sort_by} DESC;`;

    return Promise.all([fetchTopics(), db.query(strQuery, queryVals)]).then(([allTopics, articles])=> {
        //error handling
        if (articles.rows.length === 0) {
            if(allTopics.find(topicData => topicData.slug === topic) !== undefined) return articles.rows;
            return Promise.reject({ 
                status: 404, 
                msg: `No articles found for topic: ${topic}` })};
        console.log(articles.rows)
        return articles.rows;
    });
};

exports.updateVotes = (newVotes, article_id) => {
    return db
    .query(`UPDATE articles
         SET votes = votes + $1
         WHERE  article_id = $2
         RETURNING *`, 
         [newVotes.inc_votes, article_id])
         .then((result) => {
            return result.rows[0];
         });
};

