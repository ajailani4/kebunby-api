const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db-config');
const { generateJwt } = require('../util/jwt-util');

const saltRounds = 10;

const register = async (request, h) => {
  const {
    username,
    email,
    password,
    name,
  } = request.payload;
  let result = '';
  let response = '';

  try {
    // Check if username is exist or not
    result = await pool.query(
      'SELECT * FROM public."user" WHERE username=$1',
      [username],
    );

    if (result.rows[0]) {
      response = h.response({
        code: 409,
        status: 'Conflict',
        message: 'Username already exists. Try another username!',
      });

      response.code(409);
    } else {
      // Hash user password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      result = await pool.query(
        'INSERT INTO public."user" (username, email, password, name) VALUES ($1, $2, $3, $4) RETURNING *',
        [username, email, hashedPassword, name],
      );

      response = h.response({
        code: 201,
        status: 'Created',
        data: {
          username: result.rows[0].username,
          accessToken: generateJwt(jwt, username),
        },
      });

      response.code(201);
    }

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

const login = async (request, h) => {
  const { username, password } = request.payload;
  let response = '';

  try {
    const result = await pool.query(
      'SELECT * FROM public."user" WHERE username=$1',
      [username],
    );

    if (result.rows[0]) {
      const hashedPassword = result.rows[0].password;

      if (await bcrypt.compare(password, hashedPassword)) {
        response = h.response({
          code: 200,
          status: 'OK',
          data: {
            username: result.rows[0].username,
            accessToken: generateJwt(jwt, username),
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
      message: 'error',
    });

    response.code(400);

    console.log(err);
  }

  return response;
};

module.exports = { register, login };
