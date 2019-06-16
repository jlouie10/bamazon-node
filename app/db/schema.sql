  DROP DATABASE IF EXISTS bamazon;

  CREATE DATABASE bamazon;

  USE bamazon;

  CREATE TABLE products (
    `item_id` INT NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(255) NOT NULL,
    `department_name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(10,2) NOT NULL,
    `stock_quantity` INT NOT NULL,
    PRIMARY KEY (`item_id`)
  );

  CREATE TABLE departments (
    `department_id` INT NOT NULL AUTO_INCREMENT,
    `department_name` VARCHAR(255) NOT NULL,
    `over_head_costs` DECIMAL(10,2) NOT NULL,
    PRIMARY KEY (`department_id`)
  );

  ALTER TABLE products
  ADD product_sales DECIMAL(10,2) NOT NULL DEFAULT 0;