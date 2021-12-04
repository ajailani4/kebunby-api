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

const getTrendingPlants = async () => {
  const result = await pool.query('SELECT * FROM public."plant" ORDER BY popularity DESC OFFSET 1 LIMIT 7');

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

const getPlantsByCategory = async (page, size, category) => {
  const result = await pool.query(
    'SELECT * FROM public."plant" WHERE category=$1 OFFSET $2 LIMIT $3',
    [category, (page - 1) * 5, size],
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
    if ((!isTrending || isTrending === 'false') && !category && !searchQ) {
      response = h.response(await getAllPlants(page, size)).code(200);
    }

    // Get trending plants
    if (isTrending === 'true') {
      response = h.response(await getTrendingPlants()).code(200);
    }

    // Get plants by category
    if (category) {
      response = h.response(await getPlantsByCategory(page, size, category)).code(200);
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
