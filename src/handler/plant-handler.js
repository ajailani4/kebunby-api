const pool = require('../db');

const getPlants = async (request, h) => {
  let { page, size } = request.query;
  const { isTrending, category, searchQuery } = request.query;
  let response = '';
  let result = '';

  try {
    page = page || 1;
    size = size || 10;

    // Get all plants
    if ((!isTrending || isTrending === 'false') && !category && !searchQuery) {
      result = await pool.query(
        'SELECT * FROM public."plant" OFFSET $1 LIMIT $2',
        [(page - 1) * size, size],
      );
    }

    // Get trending plants
    if (isTrending === 'true') {
      result = await pool.query('SELECT * FROM public."plant" ORDER BY popularity DESC LIMIT 7');
    }

    // Get plants by category
    if (category) {
      result = await pool.query(
        'SELECT * FROM public."plant" WHERE category=$1 OFFSET $2 LIMIT $3',
        [category, (page - 1) * size, size],
      );
    }

    // Get plants by search query
    if (searchQuery) {
      result = await pool.query(
        `SELECT * FROM public."plant" WHERE name LIKE '%${searchQuery}%' OFFSET $1 LIMIT $2`,
        [(page - 1) * size, size],
      );
    }

    response = h.response({
      code: 200,
      status: 'OK',
      data: result.rows.map((plant) => ({
        id: plant.id,
        name: plant.name,
        image: plant.image,
        wateringFreq: plant.watering_freq,
        popularity: plant.popularity,
      })),
    });

    response.code(200);
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