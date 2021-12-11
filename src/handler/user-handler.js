const pool = require('../config/db-config');

const getPlantsByUsername = async (request, h) => {
  const { username } = request.params;
  const { isPlanting, isPlanted, isFavorited } = request.query;
  let { page, size } = request.query;
  let response = '';
  let result = '';
  try {
    page = page || 1;
    size = size || 10;

    // Get Planting by username

    if ((!isPlanting || isPlanting === 'false') && (!isPlanted || isPlanted === 'false') && (!isFavorited || isFavorited === 'false')) {
      result = await pool.query('SELECT * FROM public."plant" WHERE author = $1 OFFSET $2 LIMIT $3', [username, (page - 1) * size, size]);
    }
    if (isPlanting === 'true') {
      result = await pool.query('SELECT * FROM public."planting" INNER JOIN public."plant" ON plant = "plant".id WHERE "user" = $1 OFFSET $2 LIMIT $3', [username, (page - 1) * size, size]);
    }
    // Get plants by category
    if (isPlanted === 'true') {
      result = await pool.query('SELECT * FROM public."planted" INNER JOIN public."plant" ON plant = "plant".id WHERE "user" = $1 OFFSET $2 LIMIT $3', [username, (page - 1) * size, size]);
    }

    // Get plants by search query
    if (isFavorited === 'true') {
      result = await pool.query('SELECT * FROM public."favorite" INNER JOIN public."plant" ON plant = "plant".id WHERE "user" = $1;', [username]);
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

const getUserProfile = async (request, h) => {
  const { username } = request.params;
  let response = '';

  try {
    const result = await pool.query('SELECT * FROM public."user" WHERE username = $1 ', [username]);

    if (result.rows[0]) {
      const profile = result.rows[0];

      response = h.response({
        ccode: 200,
        status: 'OK',
        data: {
          username: profile.username,
          email: profile.email,
          name: profile.name,
          avatar: profile.avatar,
        },
      });
      response.code(200);
    } else {
      response = h.response({
        code: 404,
        status: 'Not Found',
        message: 'User is not found',
      });

      response.code(404);
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

module.exports = { getPlantsByUsername, getUserProfile };
