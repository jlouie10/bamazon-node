const table = require('table');

// Creates a table in the display
let displayTable = (arr, data) => {
    let output;

    arr.forEach(element => {
        let row = Object.keys(element).map(key => {
            if (typeof element[key] === 'number') {
                let numberStr = '$' + element[key].toFixed(2);

                return numberStr;
            }

            return element[key];
        });

        data.push(row);
    });

    output = table.table(data);

    console.log(output);
};

module.exports = {
    table: displayTable
};