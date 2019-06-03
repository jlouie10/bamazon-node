const inquirer = require('inquirer');

// Prompts the user with a list of options
let start = () => {
    let questions = [
        {
            name: 'option',
            type: 'list',
            message: '\nSelect an option:',
            choices: [
                'View Products for Sale',
                'View Low Inventory',
                'Add to Inventory',
                'Add New Product'
            ]
        }];

    console.log('_\n');

    inquirer
        .prompt(questions)
        .then(answer => {
            console.log(answer);
        });
};

start();