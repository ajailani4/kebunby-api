const pool = require('../db');

const getPlanting = async(request, h) => {
  const { username } = request.params;
  const { isPlanting, isPlanted, isFavorited } = request.query;
  let response = '';
  let result = '';
  try {
    // Get Planting by username
    if (isPlanting === 'true') {
      result = await pool.query(
        'SELECT * FROM public. "planting" INNER JOIN public."plant" ON plant = "plant".id WHERE "user" = \'george_z\';', [username],
      );
    }
    // Get plants by category
    if (isPlanted === 'true') {
      result = await pool.query(
        'SELECT * FROM public."planted" INNER JOIN public."plant" ON plant = "plant".id WHERE "user" = $1;', [username],
      );
    }

    // Get plants by search query
    if (isFavorited === 'true') {
      result = await pool.query(
        'SELECT * FROM public."favorite" INNER JOIN public."plant" ON plant = "plant".id WHERE "user" = $1;', [username]);
    }

    response = h.response({
      code: 200,
      status: 'OK',
      data: result.rows.map((plant) => ({
        id: plant.id,
        name: plant.name,
        image: plant.image,
        wateringFreq: plant.watering_freq,
        growthEst: plant.growth_est,
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

module.exports = { getPlanting };