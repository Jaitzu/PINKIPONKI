'use strict';
const mysql = require('mysql2');


const connect = () => {
    // create the connection to database
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
    });
    return connection;
};

const select = (connection, callback, res) => {
    // simple query
    connection.query(
        'SELECT * FROM bc_media',
        (err, results, fields) => {
            // console.log(results); // results contains rows returned by server
            // console.log(fields); // fields contains extra meta data about results, if available
            console.log(err);
            callback(results, res);
        },
    );
};
//------minunsähläystätätätätätättäätät
const search = (data, connection, callback, res) => {
    // simple query
    console.log('data', data)
    connection.execute(
        'SELECT * FROM bc_media WHERE category = ?',
        data,
        (err, results, fields) => {
            // console.log(results); // results contains rows returned by server
            // console.log(fields); // fields contains extra meta data about results, if available
            console.log(err);
            callback(results, res);
        },
    );
};
//------------------------------
const insert = (data, connection, callback) => {
    // simple query
    connection.execute(
        'INSERT INTO bc_media (category, title, details, thumbnail, image, original, coordinates) VALUES (?, ?, ?, ?, ?, ?, ?);',
        data,
        (err, results, fields) => {
            // console.log(results); // results contains rows returned by server
            // console.log(fields); // fields contains extra meta data about results, if available
            console.log(err);
            callback();
        },
    );
};

const update = (data, connection) => {
    // simple query
    return connection.execute(
        'UPDATE bc_media SET category = ?, title = ?, details = ? WHERE mID = ?;',
        data,
        (err, results, fields) => {
            // console.log(results); // results contains rows returned by server
            // console.log(fields); // fields contains extra meta data about results, if available
            console.log(err);
        },
    );
};
const del = (data, connection) => {
    // simple query
    return connection.execute(
        'DELETE FROM bc_media WHERE mID = ?;',
        data,
        (err, results, fields) => {
            console.log(results); // results contains rows returned by server
            // console.log(fields); // fields contains extra meta data about results, if available
            console.log(err);
        },
    );
};
const login = (data, connection, callback) => {
    // simple query
    connection.execute(
        'SELECT * FROM bc_users WHERE email = ?;',
        data,
        (err, results, fields) => {
            console.log(results); // results contains rows returned by server
            // console.log(fields); // fields contains extra meta data about results, if available
            console.log(err);
            callback(results);
        },
    );
};

const register = (data, connection, callback) => {
    // simple query
    connection.execute(
        'INSERT INTO bc_users (email, passwd) VALUES (?, ?);',
        data,
        (err, results, fields) => {
            console.log(results); // results contains rows returned by server
            // console.log(fields); // fields contains extra meta data about results, if available
            console.log(err);
            callback();
        },
    );
};

module.exports = {
    connect: connect,
    select: select,
    insert: insert,
    update: update,
    del: del,
    search: search,
    login: login,
    register: register,
};