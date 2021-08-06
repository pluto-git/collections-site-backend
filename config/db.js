const mysql = require("mysql2");

const db = mysql.createConnection({
    user: "b6c19cbb2bd8fd",
    host: "us-cdbr-east-04.cleardb.com",
    password: "2734e552",
    database: "heroku_8ef796c49a0cd51",
  });

 // mysql://b6c19cbb2bd8fd:2734e552@us-cdbr-east-04.cleardb.com/heroku_8ef796c49a0cd51?reconnect=true
  module.exports = db;

