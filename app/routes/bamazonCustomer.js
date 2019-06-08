const mysql = require('mysql');
const prompt = require('../views/prompt.js');
const display = require('../views/display.js');

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
    connection.query('SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity > 0',
        (err, rows) => {
            if (err) throw err;

            if ((rows === undefined) ||
                (rows.length == 0)) {
                console.log('\nThere are no products for sale.\n');
            }
            else {
                let data = [['ID', 'Name', 'Department', 'Price', 'Quantity']];

                display.table(rows, data);
                purchaseProduct(rows);
            }
        });
};

// Prompts the user for a product selection
let purchaseProduct = products => {
    let questions = [
        {
            name: 'product',
            type: 'input',
            message: 'What is the ID of the product you wish to purchase?'
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'How many would you like to purchase?'
        }];

    prompt.user(questions, answers => {
        let productId = parseInt(answers.product);
        let productQuantity = parseInt(answers.quantity);
        let productExists = false;

        console.log('_\n');

        products.forEach(element => {
            if (element.item_id === productId) {
                productExists = true;

                if (element.stock_quantity >= productQuantity) {
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
    let total = quantity * price;

    connection.query(
        `UPDATE products SET product_sales = product_sales + ${total}, stock_quantity = stock_quantity - ${quantity} WHERE item_id = ${id}`,
        err => {
            if (err) throw err;

            console.log(`The total cost of your purchase is $${total.toFixed(2)}.\n`);

            connection.end();
        }
    );
};