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
        if(result.rows.length === 0){
            return Promise.reject({
                status: 404,
                msg: `No user found for username: ${username}`,
            })
        };
        return result.rows[0];
    });

};