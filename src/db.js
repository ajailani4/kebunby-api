const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
