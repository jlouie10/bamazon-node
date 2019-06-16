const connection = require('./connection.js');

let orm = {
    selectWhere: (table, columns, params, callback) => {
        let query = `SELECT ?? FROM ?? WHERE ${params}`;

        connection.query(query, [columns, table], (err, rows) => {
            if (err) throw err;

            callback(rows);
        });
    },
    selectOne: (table, columns, params, callback) => {
        let query = 'SELECT ?? FROM ?? ORDER BY ?? DESC LIMIT 1';

        connection.query(query, [columns, table, params], (err, rows) => {
            if (err) throw err;

            callback(rows);
        });
    },
    selectJoin: (tables, columns, params, callback) => {
        let query = `SELECT ${columns} FROM ?? LEFT JOIN ?? ON ${params.first} GROUP BY ${params.second}`;

        connection.query(query, [tables.first, tables.second], (err, rows) => {
            if (err) throw err;

            callback(rows);
        });
    },
    update: (table, columns, params, callback) => {
        let query = `UPDATE ?? SET ${columns} WHERE ${params}`;

        connection.query(query, [table], err => {
            if (err) throw err;

            callback();
        });
    },
    insert: (table, params, callback) => {
        let query = 'INSERT INTO ?? SET ?';

        connection.query(query, [table, params], (err, rows) => {
            if (err) throw err;

            callback(rows);
        });
    },
    endConnection: () => {
        connection.end();
    }
};

module.exports = orm;