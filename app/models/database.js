const mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

// Connect to the MySQL server
connection.connect(err => {
    if (err) throw err;
});

// Run database query and execute callback function
let query = (str, params, callback) => {
    connection.query(str, params,
        (err, rows) => {
            if (err) throw err;

            callback(rows);
        });
};

// Closes connection to database
let endConnection = () => {
    connection.end();
};

module.exports = {
    query: query,
    endConnection: endConnection
};