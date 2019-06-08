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
            'View Product Sales by Department',
            'Create New Department'
        ]
    }];

    console.log('_\n');

    promptUser(question, router);
};

// Prompt user questions and run callback function
let promptUser = (questions, callback, params) => {
    inquirer
        .prompt(questions)
        .then(answer => {
            callback(answer);
        });
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
            createDepartment(connection);
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
                displayProducts(rows);
            }

            connection.end();
        });
};

// Display products in a table
let displayProducts = arr => {
    let data = [['ID', 'Department', 'Costs', 'Total Sales', 'Total Profit']];
    let output;

    arr.forEach(element => {
        data.push([
            element.department_id,
            element.department_name,
            `$${element.over_head_costs.toFixed(2)}`,
            `$${element.product_sales.toFixed(2)}`,
            `$${element.total_profit.toFixed(2)}`
        ]);
    });

    output = table.table(data);

    console.log(output);
};

// Creates department in database
let createDepartment = connection => {
    console.log('Create New Department')
};

start();