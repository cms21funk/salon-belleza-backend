const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const config = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      allowExitOnIdle: true
    }
  : {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      allowExitOnIdle: true
    };

const pool = new Pool(config);

module.exports = pool;