const pool = require('../db');

const validateJwt = async (decoded, request, h) => {
  const query = 'SELECT * FROM user WHERE username=$1';
  let isValidated = false;

  try {
    const result = await pool.query(query, [decoded.username]);

    if (result.rows[0]) {
      isValidated = true;
    } else {
      isValidated = false;
    }
  } catch (err) {
    isValidated = false;
    console.log(err);
  }

  return { isValid: isValidated };
};

module.exports = validateJwt;
