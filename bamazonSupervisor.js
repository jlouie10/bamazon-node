const inquirer = require('inquirer');

// Prompts the user with a list of options
let start = () => {
    let question = [{
        name: 'option',
        type: 'list',
        message: 'Select an option:',
        choices: [
            'View Products Sales by Department',
            'Create New Department'
        ]
    }];

    console.log('_\n');

    promptUser(question, ans => console.log(ans));
};

// Prompt user questions and run callback function
let promptUser = (questions, callback, params) => {
    inquirer
        .prompt(questions)
        .then(answer => {
            callback(answer);
        });
};

start();