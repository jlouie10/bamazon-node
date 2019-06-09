const database = require('../models/database.js');
const prompt = require('../views/prompt.js');
const display = require('../views/display.js');

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

    switch (res.option) {
        case 'View Products for Sale':
            getProducts();
            break;
        case 'View Low Inventory':
            getInventory();
            break;
        case 'Add to Inventory':
            addInventory();
            break;
        case 'Add New Product':
            addProduct();
    }
};

// Fetch products from Bamazon database and display in table
let getProducts = () => {
    database.get('SELECT * FROM products', rows => {
        if ((rows === undefined) ||
            (rows.length == 0)) {
            console.log("\nThere are no products in the store's inventory.\n");
        }
        else {
            displayProducts(rows);
        }

        database.endConnection();
    });
};

// Display products in a table
let displayProducts = arr => {
    let data = [['ID', 'Name', 'Department', 'Price', 'Quantity', 'Sales']];

    display.table(arr, data);
};

// Fetch low inventory products from Bamazon database and display in table
let getInventory = connection => {
    database.get('SELECT * FROM products WHERE stock_quantity < 5', rows => {
        if ((rows === undefined) ||
            (rows.length == 0)) {
            console.log('\nAll inventory is sufficient.\n');
        }
        else {
            displayProducts(rows);
        }

        database.endConnection();
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
let updateQuantity = res => {
    database.update(
        `UPDATE products SET stock_quantity = stock_quantity + ${res.quantity} WHERE item_id = ${res.product}`,
        () => {
            console.log('\nQuantity has been added to inventory.\n');

            database.get(`SELECT * FROM products WHERE item_id = ${res.product}`,
                row => {
                    displayProducts(row);
                    database.endConnection();
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
let createProduct = res => {
    database.createRow(
        "INSERT INTO products SET ?",
        {
            product_name: res.name,
            department_name: res.department,
            price: res.price.replace('$', ''),
            stock_quantity: res.quantity
        },
        () => {
            console.log(`\n${res.name} has been added to the store.\n`);

            database.get('SELECT * FROM products ORDER BY item_id DESC LIMIT 1',
                row => {
                    displayProducts(row);
                    database.endConnection();
                }
            );
        }
    );
};

module.exports = {
    start: start
};