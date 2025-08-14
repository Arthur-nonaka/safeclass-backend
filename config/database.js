const mysql = require("mysql2/promise");
require("dotenv").config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conectado ao banco de dados MySQL");
    connection.release();
  } catch (error) {
    console.error("❌ Erro ao conectar com o banco de dados:", error.message);
  }
};

module.exports = { pool, testConnection };
