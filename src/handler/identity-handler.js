const bcrypt = require('bcrypt');
const pool = require('../db');

const saltRounds = 10;

const register = async (request, h) => {
  const {
    username, email, password, name,
  } = request.payload;
  const query = 'INSERT INTO public."user" (username, email, password, name) VALUES ($1, $2, $3, $4) RETURNING *';
  let response = '';

  try {
    // Hash user password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query(query, [username, email, hashedPassword, name]);

    response = h.response({
      code: 201,
      status: 'Created',
      data: {
        username: result.rows[0].username,
        accessToken: 'test',
      },
    });

    response.code(201);

    return response;
  } catch (err) {
    response = h.response({
      code: 400,
      status: 'Bad Request',
      message: 'error',
    });

    response.code(400);

    console.log(err);
  }

  return response;
};

module.exports = {
  register,
};
