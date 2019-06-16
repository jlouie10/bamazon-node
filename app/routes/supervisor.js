const orm = require('../config/orm.js');
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
    switch (res.option) {
        case 'View Product Sales by Department':
            viewSales();
            break;
        case 'Create New Department':
            addDepartment();
    }
};

// Query the Bamazon database for total profit and display in table
let viewSales = () => {
    let tables = {
        first: 'departments',
        second: 'products'
    }
    let columns = `department_id, departments.department_name, over_head_costs, COALESCE(SUM(product_sales), 0) as product_sales, (COALESCE(SUM(product_sales), 0) - over_head_costs) as total_profit `;
    let params = {
        first: 'departments.department_name = products.department_name',
        second: 'department_id'
    };

    orm.selectJoin(tables, columns, params, rows => {
        if ((rows === undefined) ||
            (rows.length == 0)) {
            console.log('\nAll inventory is sufficient.\n');
        }
        else {
            let data = [['ID', 'Department', 'Costs', 'Total Sales', 'Total Profit']];

            display.table(rows, data);
        }

        orm.endConnection();
    });
};

// Prompt user to add a product to Bamazon database
let addDepartment = () => {
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

    prompt.user(questions, createDepartment);
};

// Creates department in database
let createDepartment = res => {
    let table = 'departments';
    let params = {
        department_name: res.department,
        over_head_costs: res.over_head_costs.replace('$', '').replace(',', '')
    };

    orm.insert(table, params, () => {
        console.log(`\n${params.department_name} department has been added.\n`);

        orm.endConnection();
    });
};

module.exports = {
    start: start
};