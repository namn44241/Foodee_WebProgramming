const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Kiểm tra kết nối
pool.getConnection((err, connection) => {
  if (err) {
      console.error('Database connection failed:', {
          message: err.message,
          code: err.code,
          errno: err.errno
      });
  } else {
      console.log('Successfully connected to database');
      connection.release();
  }
});

const promisePool = pool.promise();

module.exports = promisePool;