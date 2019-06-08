const mysql = require('mysql');
const prompt = require("./prompt.js");
const display = require("./display.js");


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

    prompt.user(question, router);
};

// After user selects a menu option, perform that action
let router = res => {
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
    let data = [['ID', 'Name', 'Department', 'Price', 'Quantity', 'Sales']];

    display.table(arr, data);
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
            message: 'What is the ID of the product you wish to add quantity for?'
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'How much would you like to add?'
        }
    ];

    prompt.user(questions, updateQuantity, { connection: connection });
};

// Updates quantity in database and displays the new quantity
let updateQuantity = (res, params) => {
    params.connection.query(
        `UPDATE products SET stock_quantity = stock_quantity + ${res.quantity} WHERE item_id = ${res.product}`,
        error => {
            if (error) throw error;

            console.log('\nQuantity has been added to inventory.\n');

            params.connection.query(`SELECT * FROM products WHERE item_id = ${res.product}`,
                (err, row) => {
                    if (err) throw err;

                    displayProducts(row);
                    params.connection.end();
                }
            );
        }
    );
};

// Prompt user to add a product to Bamazon database
let addProduct = connection => {
    let questions = [
        {
            name: 'name',
            type: 'input',
            message: 'What is the name of the product you wish to add?'
        },
        {
            name: 'department',
            type: 'input',
            message: 'Which department does the product belong to?'
        },
        {
            name: 'price',
            type: 'input',
            message: 'What is the unit cost of the product?'
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'How many of this product are you adding?'
        }
    ];

    prompt.user(questions, createProduct, { connection: connection });
};

// Creates product in database
let createProduct = (res, params) => {
    params.connection.query(
        "INSERT INTO products SET ?",
        {
            product_name: res.name,
            department_name: res.department,
            price: res.price.replace('$', ''),
            stock_quantity: res.quantity
        },
        error => {
            if (error) throw error;

            console.log(`\n${res.name} has been added to the store.\n`);

            params.connection.query('SELECT * FROM products ORDER BY item_id DESC LIMIT 1',
                (err, row) => {
                    if (err) throw err;

                    displayProducts(row);
                    params.connection.end();
                }
            );
        }
    );
};

start();