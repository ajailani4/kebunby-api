const pool = require('../config/db-config');

const validateJwt = async (decoded, request, h) => {
  let isValidated = false;

  try {
    const result = await pool.query(
      'SELECT * FROM public."user" WHERE username=$1',
      [decoded.username],
    );

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

const generateJwt = (jwt, _username) => jwt.sign(
  {
    username: _username,
  },
  process.env.JWT_SECRET,
);

module.exports = { validateJwt, generateJwt };
