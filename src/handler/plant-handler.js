const pool = require('../db');

const getAllPlants = async (page, size) => {
  const result = await pool.query(
    'SELECT * FROM public."plant" OFFSET $1 LIMIT $2',
    [(page - 1) * 5, size],
  );

  return {
    code: 200,
    status: 'OK',
    data: result.rows.map((plant) => ({
      id: plant.id,
      name: plant.name,
      image: plant.image,
      wateringFreq: plant.watering_freq,
      popularity: plant.popularity,
    })),
  };
};

const getPlants = async (request, h) => {
  let { page, size } = request.query;
  const { isTrending, category, searchQ } = request.query;
  let response = '';

  try {
    page = page || 1;
    size = size || 10;

    // Get all plants
    if (!isTrending && !category && !searchQ) {
      response = h.response(await getAllPlants(page, size)).code(200);
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
