const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'abhi',
  password: 'abhi@mysql',
  database: 'EventsInfo',
});

module.exports = db;