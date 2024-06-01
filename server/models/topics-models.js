const db = require(`${__dirname}/../../db/connection.js`);

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then((result)=> {
        return result.rows
    })
};

exports.insertNewTopic = (slug, description) => {
    return db
    .query(
      'INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;',
      [slug, description]
    )
    .then((result) => {
      return result.rows[0];
    });
}