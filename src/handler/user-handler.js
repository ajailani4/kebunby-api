const pool = require('../config/db-config');

const getUserActivities = async (request, h) => {
  const { username } = request.params;
  const { isPlanting, isPlanted, isFavorited } = request.query;
  let { page, size } = request.query;
  let response = '';
  let result = '';

  try {
    page = page || 1;
    size = size || 10;

    // Get posts
    if ((!isPlanting || isPlanting === 'false') && (!isPlanted || isPlanted === 'false') && (!isFavorited || isFavorited === 'false')) {
      result = await pool.query(
        'SELECT * FROM public."plant" WHERE author = $1 ORDER BY published_on DESC OFFSET $2 LIMIT $3',
        [username, (page - 1) * size, size],
      );
    }

    // Get planting plants
    if (isPlanting === 'true') {
      result = await pool.query(
        'SELECT * FROM public."planting" INNER JOIN public."plant" ON plant = "plant".id WHERE "user" = $1 ORDER BY "planting".id DESC OFFSET $2 LIMIT $3',
        [username, (page - 1) * size, size],
      );
    }

    // Get planted plants
    if (isPlanted === 'true') {
      result = await pool.query(
        'SELECT * FROM public."planted" INNER JOIN public."plant" ON plant = "plant".id WHERE "user" = $1 ORDER BY "planted".id DESC OFFSET $2 LIMIT $3',
        [username, (page - 1) * size, size],
      );
    }

    // Get favorite plants
    if (isFavorited === 'true') {
      result = await pool.query(
        'SELECT * FROM public."favorite" INNER JOIN public."plant" ON plant = "plant".id WHERE "user" = $1 ORDER BY "favorite".id DESC OFFSET $2 LIMIT $3',
        [username, (page - 1) * size, size],
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

const isUserActivityExist = async (username, plantId, isPlanting, isPlanted, isFavorited) => {
  let isExist = false;
  let query = '';

  try {
    if (isPlanting) {
      query = 'SELECT * FROM public."planting" WHERE "user"=$1 AND plant=$2';
    } else if (isPlanted) {
      query = 'SELECT * FROM public."planted" WHERE "user"=$1 AND plant=$2';
    } else if (isFavorited) {
      query = 'SELECT * FROM public."favorite" WHERE "user"=$1 AND plant=$2';
    }

    const result = await pool.query(
      query,
      [username, plantId],
    );

    if (result.rows[0]) {
      isExist = true;
    } else {
      isExist = false;
    }
  } catch (err) {
    console.log(err);
  }

  return isExist;
};

const addUserActivity = async (request, h) => {
  const { username } = request.params;
  const { plantId } = request.payload;
  const { isPlanting, isPlanted, isFavorited } = request.query;
  let result = '';
  let response = '';
  let isAdded = false;

  try {
    if (isPlanting) {
      if (await isUserActivityExist(username, plantId, true, false, false)) {
        response = h.response({
          code: 409,
          status: 'Conflict',
          message: 'Plant already exists',
        });

        response.code(409);
      } else {
        result = await pool.query(
          'INSERT INTO public."planting" ("user", plant) VALUES ($1, $2) RETURNING *',
          [username, plantId],
        );

        isAdded = true;
      }
    } else if (isPlanted) {
      if (await isUserActivityExist(username, plantId, false, true, false)) {
        response = h.response({
          code: 409,
          status: 'Conflict',
          message: 'Plant already exists',
        });

        response.code(409);
      } else {
        result = await pool.query(
          'INSERT INTO public."planted" ("user", plant) VALUES ($1, $2) RETURNING *',
          [username, plantId],
        );

        isAdded = true;
      }
    } else if (isFavorited) {
      if (await isUserActivityExist(username, plantId, false, false, true)) {
        response = h.response({
          code: 409,
          status: 'Conflict',
          message: 'Plant already exists',
        });

        response.code(409);
      } else {
        result = await pool.query(
          'INSERT INTO public."favorite" ("user", plant) VALUES ($1, $2) RETURNING *',
          [username, plantId],
        );

        isAdded = true;
      }
    }

    if (isAdded) {
      if (result) {
        response = h.response({
          code: 201,
          status: 'Created',
          message: 'New user plant has been added successfully',
        });
      } else {
        response = h.response({
          code: 500,
          status: 'Internal Server Error',
          message: 'New user plant cannot be added',
        });

        response.code(500);
      }
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

const deleteUserActivity = async (request, h) => {
  const { username, plantId } = request.params;
  const { isPlanting, isPlanted, isFavorited } = request.query;
  let result = '';
  let response = '';
  let isDeleted = false;

  try {
    if (isPlanting) {
      if (await isUserActivityExist(username, plantId, true, false, false)) {
        result = await pool.query(
          'DELETE FROM public."planting" WHERE "user"=$1 AND plant=$2',
          [username, plantId],
        );

        isDeleted = true;
      } else {
        response = h.response({
          code: 404,
          status: 'Not found',
          message: 'Plant is not found',
        });

        response.code(409);
      }
    } else if (isPlanted) {
      if (await isUserActivityExist(username, plantId, false, true, false)) {
        result = await pool.query(
          'DELETE FROM public."planted" WHERE "user"=$1 AND plant=$2',
          [username, plantId],
        );

        isDeleted = true;
      } else {
        response = h.response({
          code: 404,
          status: 'Not found',
          message: 'Plant is not found',
        });

        response.code(409);
      }
    } else if (isFavorited) {
      if (await isUserActivityExist(username, plantId, false, false, true)) {
        result = await pool.query(
          'DELETE FROM public."favorite" WHERE "user"=$1 AND plant=$2',
          [username, plantId],
        );

        isDeleted = true;
      } else {
        response = h.response({
          code: 404,
          status: 'Not found',
          message: 'Plant is not found',
        });

        response.code(409);
      }
    }

    if (isDeleted) {
      if (result) {
        response = h.response({
          code: 200,
          status: 'OK',
          message: 'Plant has been deleted',
        });
      } else {
        response = h.response({
          code: 500,
          status: 'Internal Server Error',
          message: 'New user plant cannot be added',
        });

        response.code(500);
      }
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

const getUserProfile = async (request, h) => {
  const { username } = request.params;
  let response = '';

  try {
    const result = await pool.query(
      'SELECT * FROM public."user" WHERE username = $1',
      [username],
    );

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

module.exports = {
  getUserActivities,
  isUserActivityExist,
  addUserActivity,
  deleteUserActivity,
  getUserProfile,
};
