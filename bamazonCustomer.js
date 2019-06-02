const mysql = require('mysql');
const inquirer = require('inquirer');

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

        console.log('\nID | Name | Department | Price | Stock')

        rows.forEach(element => {
            console.log(`${element.item_id} | ${element.product_name} | ${element.department_name} | $${element.price.toFixed(2)} | ${element.stock_quantity}`);
        });

        promptUser();
    });
};

// Prompts the user for a product selection
let promptUser = () => {
    let questions = [
        {
            name: 'product',
            type: 'input',
            message: "Please enter the ID of the product you wish to purchase."
        },
        {
            name: 'quantity',
            type: 'input',
            message: "How many would you like to purchase?"
        }];

    console.log('_\n');

    inquirer
        .prompt(questions)
        .then((answer) => {
            console.log(`Product ID: ${answer.product}\nQuantity: ${answer.quantity}`);

            connection.end();
        });
};