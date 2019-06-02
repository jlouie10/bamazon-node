const mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

// Connect to the MySQL server
connection.connect((err) => {
    if (err) throw err;
    displayProducts();
});

// Displays all the products in the database
let displayProducts = () => {
    connection.query('SELECT * FROM products', (err, rows) => {
        if (err) throw err;

        console.log('ID | Name | Department | Price | Stock')

        rows.forEach(element => {
            console.log(`${element.item_id} | ${element.product_name} | ${element.department_name} | $${element.price.toFixed(2)} | ${element.stock_quantity}`);
        });

        connection.end();
    });
};