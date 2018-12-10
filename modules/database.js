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
        'SELECT * FROM bb_media',
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
        'INSERT INTO bb_media ( details, thumbnail, original, coordinates, ball_ID, uID) VALUES (?,?, ?, ?, ?, ?);',
        data,
        (err, results, fields) => {
            // console.log(results); // results contains rows returned by server
            // console.log(fields); // fields contains extra meta data about results, if available
            console.log(err);
            callback();
        },
    );
};


const del = (data, connection) => {
    // simple query
    return connection.execute(
        'DELETE FROM bb_media WHERE mID = ?;',
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
        'SELECT * FROM bb_user WHERE email = ?;',
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
        'INSERT INTO bb_user (email, password) VALUES (?, ?);',
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
    del: del,
    login: login,
    register: register,
};