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

INSERT INTO products (`product_name`, `department_name`, `price`, `stock_quantity`)
VALUES ("Chef's Knife", 'Kitchen', 9.99, 50),
  ('Cutting Board', 'Kitchen', 5.99, 200),
  ('Mixing Bowls', 'Kitchen', 22.95, 100),
  ('Measuring Cups', 'Kitchen', 7.99, 300),
  ('Can Opener', 'Kitchen', 12.00, 75),
  ('Colander', 'Kitchen', 13.99, 25),
  ('Vegetable Peeler', 'Kitchen', 8.75, 50),
  ('Spoons, Whisks, Spatulas, and Tongs', 'Kitchen', 20.00, 100),
  ('Thermometer', 'Kitchen', 11.99, 10),
  ('Potholder', 'Kitchen', 9.99, 125);

CREATE TABLE departments (
  `department_id` INT NOT NULL AUTO_INCREMENT,
  `department_name` VARCHAR(255) NOT NULL,
  `over_head_costs` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`department_id`)
);

INSERT INTO departments (`department_name`, `over_head_costs`)
VALUES ('Kitchen', 10000),
  ('Books', 5000);