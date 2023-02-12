CREATE DATABASE todoapp;

/*todos table*/
CREATE TABLE todos(
id VARCHAR(255) PRIMARY KEY,
user_email VARCHAR(255),
title VARCHAR(30),
progress INT,
date VARCHAR(300)
)



/*users table*/
CREATE TABLE users(
email VARCHAR(255) PRIMARY KEY,
hashed_password VARCHAR(255)
)