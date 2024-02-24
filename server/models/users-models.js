const db = require(`${__dirname}/../../db/connection.js`);

exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users`)
    .then((result)=>{
        return result.rows;
    });
};

exports.fetchUsersByUsername = (username) => {
    return db.query(`SELECT * FROM users
    WHERE username = $1`, [username])
    .then((result) => {
        return result.rows[0];
    });

};