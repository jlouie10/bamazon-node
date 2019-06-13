const inquirer = require('inquirer');

// Prompts the user a set of questions and runs a callback function from the answers
let promptUser = (questions, callback) => {
    inquirer
        .prompt(questions)
        .then(answers => {
            callback(answers);
        });
};

module.exports = {
    user: promptUser
};