const mysql = require('mysql');
const inquirer = require('inquirer');
const table = require('table');

// Prompts the user with a list of options
let start = () => {
    let question = [{
        name: 'option',
        type: 'list',
        message: 'Select an option:',
        choices: [
            'View Products for Sale',
            'View Low Inventory',
            'Add to Inventory',
            'Add New Product'
        ]
    }];

    console.log('_\n');

    promptUser(question, performAction);
};

// Prompt user questions and run callback function
let promptUser = (questions, callback, params) => {
    inquirer
        .prompt(questions)
        .then(answer => {
            callback(answer, params);
        });
};

// After user selects a menu option, perform that action
let performAction = res => {
    let connection = mysql.createConnection({
        host: 'localhost',
        port: 8889,
        user: 'root',
        password: 'root',
        database: 'bamazon'
    });

    switch (res.option) {
        case 'View Products for Sale':
            getProducts(connection);
            break;
        case 'View Low Inventory':
            getInventory(connection);
            break;
        case 'Add to Inventory':
            addInventory(connection);
            break;
        case 'Add New Product':
            addProduct(connection);
    }
};

// Fetch products from Bamazon database and display in table
let getProducts = connection => {
    connection.query('SELECT * FROM products', (err, rows) => {
        if (err) throw err;

        if ((rows === undefined) ||
            (rows.length == 0)) {
            console.log("\nThere are no products in the store's inventory.\n");
        }
        else {
            displayProducts(rows);
        }

        connection.end();
    });
};

// Display products in a table
let displayProducts = arr => {
    let data = [['ID', 'Name', 'Department', 'Price', 'Quantity']];
    let output;

    arr.forEach(element => {
        data.push([
            element.item_id,
            element.product_name,
            element.department_name,
            `$${element.price.toFixed(2)}`,
            element.stock_quantity
        ]);
    });

    output = table.table(data);

    console.log(output);
};

// Fetch low inventory products from Bamazon database and display in table
let getInventory = connection => {
    connection.query('SELECT * FROM products WHERE stock_quantity < 5', (err, rows) => {
        if (err) throw err;

        if ((rows === undefined) ||
            (rows.length == 0)) {
            console.log('\nAll inventory is sufficient.\n');
        }
        else {
            displayProducts(rows);
        }

        connection.end();
    });
};

// Prompt user to add inventory to an item in Bamazon database
let addInventory = connection => {
    let questions = [
        {
            name: 'product',
            type: 'input',
            message: 'Enter the ID of the product you wish to add quantity for.'
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'How much would you like to add?'
        }];

    promptUser(questions, updateQuantity, { connection: connection });
};

// Updates quantity in database and displays the new quantity
let updateQuantity = (res, params) => {
    params.connection.query(
        `UPDATE products SET stock_quantity = stock_quantity + ${res.quantity} WHERE item_id = ${res.product}`,
        error => {
            if (error) throw error;

            console.log(`Quantity has been added to inventory.\n`);

            params.connection.query(`SELECT * FROM products WHERE item_id = ${res.product}`,
                (err, rows) => {
                    if (err) throw err;

                    displayProducts(rows);
                    params.connection.end();
                });
        });
};

// Prompt user to add a product to Bamazon database
let addProduct = connection => {
    console.log('addProduct');
};

start();