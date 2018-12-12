'use strict';
const mysql = require('mysql2');

//tietokantayhteys
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
//kuvien haku tietokannasta
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

//kuvien lisääminen tietokantaan
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

//delete
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
//sisäänkirjautuminen
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
//käyttäjätunnuksen luonti tietokantaan
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
//koordinaattien haku tietokannasta
const getCords = (connection, callback, res) => {
    connection.query(
        'SELECT ball_coordinates FROM bb_ball WHERE ball_ID=1;',
        (err, results) => {
            console.log("koord" + results);
            console.log(err);
            callback(results, res);
        }
    )
};
//koordinaattien päivitys tietokantaan
const updCords = (data, connection) => {
    connection.execute(
        'UPDATE `bb_ball` SET `ball_coordinates`= ? WHERE ball_ID = 1;',
        data,
        (err, results) => {
            console.log(results);
            console.log(err);
        }
    )
};
//tykkäys
const upVote = (data, connection) => {
    // simple query
    connection.execute(
        'UPDATE bb_media SET points = points + 1 WHERE media_ID = ?;',
        data,
        (err, results, fields) => {
            // console.log(results); // results contains rows returned by server
            // console.log(fields); // fields contains extra meta data about results, if available
            console.log(err);
        },
    );
};
//future feature
const downVote = (data, connection) => {
    // simple query
    connection.execute(
        'UPDATE bb_media SET points = points - 1 WHERE media_ID = ? AND userID = ?;',
        data,
        (err, results, fields) => {
            // console.log(results); // results contains rows returned by server
            // console.log(fields); // fields contains extra meta data about results, if available
            console.log(err);
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
    getCords: getCords,
    updCords: updCords,
    upVote: upVote,
    downVote: downVote,
};