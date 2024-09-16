# ACE BOOKSTORE

## Overview

The Ace Bookstore API is a backend service that supports book browsing, shopping cart management, and order processing. This document provides instructions for setting up the MySQL database and running the server.

## Prerequisites

1. MySQL Database: Ensure MySQL is installed and running on your machine.

2. Node.js and npm: Make sure Node.js and npm are installed. You can download them from Node.js official website.

## Database Setup

1. Create the Database:

CREATE DATABASE acebookstore
/_!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci _/
/_!80016 DEFAULT ENCRYPTION='N' _/;

2. Create the Tables:

Execute the following SQL queries to create the required tables:

CREATE TABLE books (
bookId int NOT NULL AUTO_INCREMENT,
title varchar(255) DEFAULT NULL,
author varchar(255) DEFAULT NULL,
price decimal(10,2) DEFAULT NULL,
stock int DEFAULT NULL,
description text,
PRIMARY KEY (bookId)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE cart (
cartId int NOT NULL AUTO_INCREMENT,
userId int DEFAULT NULL,
PRIMARY KEY (cartId),
KEY userId (userId),
CONSTRAINT cart_ibfk_1 FOREIGN KEY (userId) REFERENCES users (userId)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE cart_items (
cartItemId int NOT NULL AUTO_INCREMENT,
cartId int DEFAULT NULL,
bookId int DEFAULT NULL,
quantity int DEFAULT NULL,
PRIMARY KEY (cartItemId),
KEY cartId (cartId),
KEY bookId (bookId),
CONSTRAINT cart_items_ibfk_1 FOREIGN KEY (cartId) REFERENCES cart (cartId),
CONSTRAINT cart_items_ibfk_2 FOREIGN KEY (bookId) REFERENCES books (bookId)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE order_items (
orderItemId int NOT NULL AUTO_INCREMENT,
orderId int DEFAULT NULL,
bookId int DEFAULT NULL,
quantity int DEFAULT NULL,
price decimal(10,2) DEFAULT NULL,
PRIMARY KEY (orderItemId),
KEY orderId (orderId),
KEY bookId (bookId),
CONSTRAINT order_items_ibfk_1 FOREIGN KEY (orderId) REFERENCES orders (orderId),
CONSTRAINT order_items_ibfk_2 FOREIGN KEY (bookId) REFERENCES books (bookId)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE orders (
orderId int NOT NULL AUTO_INCREMENT,
userId int DEFAULT NULL,
totalAmount decimal(10,2) DEFAULT NULL,
createdAt timestamp NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (orderId),
KEY userId (userId),
CONSTRAINT orders_ibfk_1 FOREIGN KEY (userId) REFERENCES users (userId)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE users (
userId int NOT NULL AUTO_INCREMENT,
name varchar(100) DEFAULT NULL,
email varchar(100) DEFAULT NULL,
password varchar(255) DEFAULT NULL,
role enum('customer','admin') DEFAULT 'customer',
PRIMARY KEY (userId),
UNIQUE KEY email (email)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

## Server Setup

**Clone the Repository:**

Clone the repository to your local machine

**Install Dependencies:**

Navigate to the project directory and install the required Node.js dependencies:

npm install

**Run the Server:**

Start the server using the following command:

npm start

The server will start and listen on http://localhost:3000

API Endpoints
Refer to the project's documentation or codebase for detailed information on available API endpoints and how to use them.
