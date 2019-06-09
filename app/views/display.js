const table = require('table');

// Creates a table in the display
let displayTable = (arr, data) => {
    let output;

    arr.forEach(element => {
        let row = Object.keys(element).map(key => {
            if ((key === 'price') ||
                (key === 'product_sales') ||
                (key === 'over_head_costs') ||
                (key === 'total_profit')) {

                let numStr = '$' + element[key].toLocaleString(undefined, { minimumFractionDigits: 2 });

                return numStr;
            }
            else if (typeof element[key] === 'number') {
                let num = element[key].toLocaleString();

                return num;
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