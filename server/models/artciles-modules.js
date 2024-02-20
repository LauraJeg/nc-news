const db = require(`${__dirname}/../../db/connection.js`);

exports.fetchArticleById = (article_id) => {
    return db
    .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then((result) => {
        const article = result.rows[0];
        if(!article) {
        return Promise.reject({
            status: 404,
            msg: `No article found for article_id: ${article_id}`,
          })};git 
        return result.rows[0];
    });
};

exports.fetchArticles = ()=> {
    return db.query(`SELECT article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id) as comment_count FROM articles
    LEFT JOIN comments USING (article_id)
    GROUP BY article_id
    ORDER BY articles.created_at DESC;`).then((result)=>{
        return result.rows;
    });
};