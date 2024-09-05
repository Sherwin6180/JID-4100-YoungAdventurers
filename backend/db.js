// connect to AWS database
const mysql = require('mysql');

const db = mysql.createConnection({
  host     : 'database-2.croas0wiukl6.us-east-2.rds.amazonaws.com',
  port     : '3306',
  user     : 'admin',
  password : '12345678',
  database: 'evaluation'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

module.exports = db;
