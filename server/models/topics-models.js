const db = require(`${__dirname}/../../db/connection.js`);

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics;`)
    .then((result)=> {
        return result.rows
    })
}