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

// Fetch database and run callback function
let getDatabase = (str, callback) => {
    connection.query(str, (err, rows) => {
        if (err) throw err;

        callback(rows);
    });
};

// Create row in database and run callback function
let createRow = (str, params, callback) => {
    connection.query(str, params, err => {
        if (err) throw err;

        callback(err);
    });
};

// Update database and run callback function
let updateDatabase = (str, callback) => {
    connection.query(str, err => {
        if (err) throw err;

        callback(err);
    });
};

// Closes connection to database
let endConnection = () => {
    connection.end();
};

module.exports = {
    get: getDatabase,
    createRow: createRow,
    update: updateDatabase,
    endConnection: endConnection
};