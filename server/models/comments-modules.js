const db = require(`${__dirname}/../../db/connection.js`);


    exports.fetchComments = (article_id) => {
        return db
        .query('SELECT * FROM comments WHERE article_id = $1;', [article_id])
        .then((result) => {
            const comments = result.rows;
            if(comments=== 0) {
            return Promise.reject({
                status: 404,
                msg: `No comments found for article_id: ${article_id}`,
              })};
            return comments;
        });
    };

    exports.insertNewComment = ({username, body}, article_id) => {
        return db
        .query(
          'INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *;',
          [username, body, article_id]
        )
        .then((result) => {
          return result.rows[0];
        });
    };