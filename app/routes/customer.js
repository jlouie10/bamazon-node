const orm = require('../config/orm.js');
const prompt = require('../views/prompt.js');
const display = require('../views/display.js');

// Query the database for products, display products, and prompt user
let start = () => {
    let table = 'products';
    let columns = ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'];
    let params = 'stock_quantity > 0';

    orm.selectWhere(table, columns, params, rows => {
        if ((rows === undefined) ||
            (rows.length == 0)) {
            console.log('\nThere are no products for sale.\n');
        }
        else {
            let data = [['ID', 'Name', 'Department', 'Price', 'Quantity']];

            display.table(rows, data);
            purchaseProduct(rows);
        }
    });
};

// Prompts the user for a product selection
let purchaseProduct = products => {
    let questions = [
        {
            name: 'product',
            type: 'input',
            message: 'What is the ID of the product you wish to purchase?'
        },
        {
            name: 'quantity',
            type: 'input',
            message: 'How many would you like to purchase?'
        }];

    prompt.user(questions, answers => {
        let productId = parseInt(answers.product.replace(',', ''));
        let productQuantity = parseInt(answers.quantity.replace(',', ''));
        let productExists = false;

        console.log('_\n');

        products.forEach(element => {
            if (element.item_id === productId) {
                productExists = true;

                if (element.stock_quantity >= productQuantity) {
                    fulfillOrder(productId, productQuantity, element.price);
                }
                else {
                    console.log('Insufficient quantity!')
                    orm.endConnection();
                }
            }
        });

        if (productExists === false) {
            console.log('Product ID not found.')
            orm.endConnection();
        }
    });
};

// Updates quantity in database and prints total
let fulfillOrder = (id, quantity, price) => {
    let total = quantity * price;
    let table = 'products';
    let columns = `product_sales = product_sales + ${total}, stock_quantity = stock_quantity - ${quantity}`;
    let params = `item_id = ${id}`;

    orm.update(table, columns, params, () => {
        console.log(`The total cost of your purchase is $${total.toFixed(2)}.\n`);

        orm.endConnection();
    });
};

module.exports = {
    start: start
};