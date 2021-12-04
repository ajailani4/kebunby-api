const pool = require('../db');

const getPlants = async (request, h) => {
  let { page, size } = request.query;
  const { isTrending, category, searchQ } = request.query;
  let response = '';

  try {
    page = page || 1;
    size = size || 5;

    if (!isTrending && !category && !searchQ) {
      const result = pool.query(
        'SELECT * FROM public."plant" OFFSET $1 LIMIT $2',
        [(page - 1) * 5, size],
      );

      response = h.response({
        code: 200,
        status: 'OK',
        data: (await result).rows,
      });

      response.code(200);
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

module.exports = { getPlants };
