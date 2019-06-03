const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('table');

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

    start();
});

// Query the database for products, display products, and prompt user
let start = () => {
    connection.query('SELECT * FROM products', (err, rows) => {
        if (err) throw err;

        let products = getProducts(rows);

        displayProducts(products);
        promptUser(products);
    });
};

// Creates an array of products from the database query
let getProducts = arr => {
    let productsArr = [];

    arr.forEach(element => {
        productsArr.push({
            id: element.item_id,
            name: element.product_name,
            department: element.department_name,
            price: element.price,
            quantity: element.stock_quantity
        });
    });

    return productsArr;
};

// Displays all the products in the database
let displayProducts = arr => {
    let data = [['ID', 'Name', 'Department', 'Price', 'Quantity']];
    let output;

    arr.forEach(element => {
        data.push([
            element.id,
            element.name,
            element.department,
            `$${element.price.toFixed(2)}`,
            element.quantity
        ]);
    });

    output = table.table(data);

    console.log(output);
};

// Prompts the user for a product selection
let promptUser = products => {
    let questions = [
        {
            name: 'product',
            type: 'input',
            message: 'Please enter the ID of the product you wish to purchase.'
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'How many would you like to purchase?'
        }];

    inquirer
        .prompt(questions)
        .then(answer => {
            let productId = parseInt(answer.product);
            let productQuantity = parseInt(answer.quantity);
            let productExists = false;

            console.log('_\n');

            products.forEach(element => {
                if (element.id === productId) {
                    productExists = true;

                    if (element.quantity >= productQuantity) {
                        fulfillOrder(productId, productQuantity, element.price);
                    }
                    else {
                        console.log('Insufficient quantity!')
                        connection.end();
                    }
                }
            });

            if (productExists === false) {
                console.log('Product ID not found.')
                connection.end();
            }
        });
};

// Updates quantity in database and prints total
let fulfillOrder = (id, quantity, price) => {
    connection.query(
        `UPDATE products SET stock_quantity = stock_quantity - ${quantity} WHERE item_id = ${id}`,
        err => {
            if (err) throw err;

            let total = quantity * price;

            console.log(`The total cost of your purchase is $${total.toFixed(2)}.\n`);

            connection.end();
        });
};