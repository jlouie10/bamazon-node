const mysql = require('mysql');
const prompt = require('../views/prompt.js');
const display = require('../views/display.js');

// Prompts the user with a list of options
let start = () => {
    let question = [{
        name: 'option',
        type: 'list',
        message: 'Select an option:',
        choices: [
            'View Product Sales by Department',
            'Create New Department'
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
        case 'View Product Sales by Department':
            viewSales(connection);
            break;
        case 'Create New Department':
            addDepartment(connection);
    }
};

// Query the Bamazon database for total profit and display in table
let viewSales = connection => {
    connection.query('SELECT department_id, departments.department_name, over_head_costs, SUM(product_sales) as product_sales, (SUM(product_sales) - over_head_costs) as total_profit FROM departments JOIN products ON departments.department_name = products.department_name GROUP BY department_id',
        (err, rows) => {
            if (err) throw err;

            if ((rows === undefined) ||
                (rows.length == 0)) {
                console.log('\nAll inventory is sufficient.\n');
            }
            else {
                let data = [['ID', 'Department', 'Costs', 'Total Sales', 'Total Profit']];

                display.table(rows, data);
            }

            connection.end();
        });
};

// Prompt user to add a product to Bamazon database
let addDepartment = connection => {
    let questions = [
        {
            name: 'department',
            type: 'input',
            message: 'Which department do you wish to add?'
        },
        {
            name: 'over_head_costs',
            type: 'input',
            message: 'What are the overhead costs?'
        }
    ];

    prompt.user(questions, createDepartment, { connection: connection });
};

// Creates department in database
let createDepartment = (res, params) => {
    params.connection.query(
        "INSERT INTO departments SET ?",
        {
            department_name: res.department,
            over_head_costs: res.over_head_costs.replace('$', '')
        },
        error => {
            if (error) throw error;

            console.log(`\n${res.department} has been added.\n`);

            params.connection.end();
        }
    );
};

start();