const pool = require('../config/db-config');
const { isUserActivityExist } = require('../util/user-util');
const { getPlantCategory } = require('../util/category-util');

const getPlantsByCategoryId = async (request, h) => {
  let { page, size } = request.query;
  const { id } = request.params;
  const { username } = request.auth.credentials;
  let response = '';

  try {
    page = page || 1;
    size = size || 10;

    const result = await pool.query(
      'SELECT * FROM public."plant" WHERE category=$1 OFFSET $2 LIMIT $3',
      [id, (page - 1) * size, size],
    );

    response = h.response({
      code: 200,
      status: 'OK',
      data: await Promise.all(result.rows.map(async (plant) => ({
        id: plant.id,
        name: plant.name,
        image: plant.image,
        category: await getPlantCategory(plant.category),
        wateringFreq: plant.watering_freq,
        popularity: plant.popularity,
        isFavorited: await isUserActivityExist(username, plant.id, false, false, true),
      }))),
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

const getPlantCategories = async (request, h) => {
  let response = '';

  try {
    const result = await pool.query('SELECT * FROM public."category"');

    response = h.response({
      code: 200,
      status: 'OK',
      data: result.rows.map((category) => ({
        id: category.id,
        category: category.category,
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

module.exports = { getPlantsByCategoryId, getPlantCategories };
