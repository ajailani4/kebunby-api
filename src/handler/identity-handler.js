const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

    // Generate JWT Token
    const jwtToken = jwt.sign(
      {
        username: result.rows[0].username,
      },
      process.env.JWT_SECRET,
    );

    response = h.response({
      code: 201,
      status: 'Created',
      data: {
        username: result.rows[0].username,
        accessToken: jwtToken,
      },
    });

    response.code(201);

    return response;
  } catch (err) {
    response = h.response({
      code: 400,
      status: 'Bad Request',
      message: err.message,
    });

    response.code(400);

    console.log(err);
  }

  return response;
};

const login = async (request, h) => {
  const { username, password } = request.payload;
  const query = 'SELECT * FROM public."user" WHERE username=$1';
  let response = '';

  try {
    const result = await pool.query(query, [username]);

    if (result.rows[0]) {
      const hashedPassword = result.rows[0].password;

      if (await bcrypt.compare(password, hashedPassword)) {
        // Generate JWT Token
        const jwtToken = jwt.sign(
          {
            username: result.rows[0].username,
          },
          process.env.JWT_SECRET,
        );

        response = h.response({
          code: 200,
          status: 'OK',
          data: {
            username: result.rows[0].username,
            accessToken: jwtToken,
          },
        });

        response.code(200);
      } else {
        response = h.response({
          code: 401,
          status: 'Unauthorized',
          message: 'Username or password is incorrect',
        });

        response.code(401);
      }
    } else {
      response = h.response({
        code: 401,
        status: 'Unauthorized',
        message: 'Username or password is incorrect',
      });

      response.code(401);
    }
  } catch (err) {
    response = h.response({
      code: 400,
      status: 'Bad Request',
      message: err.message,
    });

    response.code(400);

    console.log(err);
  }

  return response;
};

module.exports = { register, login };
