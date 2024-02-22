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
          })};
        return article;
    });
};

exports.fetchArticles = (topic)=> {
    const queryVals = [];
    let strQuery = `SELECT article_id, articles.author, title, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments.comment_id) as comment_count FROM articles
    LEFT JOIN comments USING (article_id)`;

    if(topic){
        queryVals.push(topic);
        strQuery += `WHERE topic = $1`;
    }
    strQuery += `GROUP BY article_id
    ORDER BY articles.created_at DESC;`;
    return db.query(strQuery, queryVals).then((result)=>{
        return result.rows;
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
            if (result.rows.length === 0) {return Promise.reject({ status: 400, msg: 'bad request' })};
            return result.rows[0];
         });
};

