const pool = require('../db');

const register = async (request, h) => {
  const { username, email, password } = request.payload;
  const query = 'INSERT INTO public."user" (username, email, password) VALUES ($1, $2, $3) RETURNING *';
  let response = '';

  try {
    const result = await pool.query(query, [username, email, password]);
    console.log(result);

    response = h.response(result.rows[0]);

    return response;
  } catch (err) {
    response = h.response({
      message: 'error',
    });

    console.log(err);
  }

  return response;
};

module.exports = {
  register,
};
