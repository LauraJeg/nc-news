const db = require(`${__dirname}/../../db/connection.js`);


    exports.fetchComments = (article_id) => {
        return db
        .query(`SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body, comments.article_id FROM comments 
        RIGHT JOIN  articles  USING (article_id)
        WHERE article_id = $1;`, [article_id])
        .then((result) => {
            const comments = result.rows;
            if (comments.length === 0) return Promise.reject(({
              status: 404,
              msg: `No article found for article_id: ${article_id}`,
            }));
            if(comments[0].comment_id === null) {
            return []};
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

    exports.removeComment = (comment_id) => {
      return db.query('DELETE FROM comments WHERE comment_id = $1;', [comment_id])
      .then((result)=> {
        if (result.rowCount === 0) {
          return Promise.reject({
            status: 404,
            msg: `No comment found for comment_id: ${comment_id}`,
          });
        };
        return result
      });
    };

    exports.updateVotesInComment = (newVotes, comment_id) => {
      return db.query(`UPDATE comments
                  SET votes = votes + $1
                  WHERE  comment_id = $2
                  RETURNING *`, 
                  [newVotes.inc_votes, comment_id])
                  .then((result) => {
                      return result.rows[0];
                  });
    };

    exports.fetchCommentById =(comment_id) => {
      return db.query(`SELECT * FROM comments
                      WHERE comment_id = $1`, [comment_id])
            .then((result)=> {
              if(result.rows.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: `No comment found for comment_id: ${comment_id}`,
                  })};
              return result.rows[0];
            })

    }