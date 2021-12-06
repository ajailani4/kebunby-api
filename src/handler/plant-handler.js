const pool = require('../config/db-config');
const { uploadImage } = require('../utils/multer-utils');

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
      result = await pool.query(
        'SELECT * FROM public."plant" ORDER BY popularity DESC OFFSET $1 LIMIT $2',
        [(page - 1) * size, size],
      );
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

const getPlantDetails = async (request, h) => {
  const { id } = request.params;
  let response = '';

  try {
    const result = await pool.query(
      'SELECT * FROM public."plant" WHERE id=$1',
      [id],
    );

    if (result.rows[0]) {
      const plant = result.rows[0];

      response = h.response({
        code: 200,
        status: 'OK',
        data: {
          id: plant.id,
          name: plant.name,
          latinName: plant.latin_name,
          image: plant.image,
          category: 1,
          wateringFreq: plant.watering_freq,
          growthEst: plant.growth_est,
          tools: plant.tools,
          materials: plant.materials,
          steps: plant.steps,
          popularity: plant.popularity,
          author: plant.author,
          publishedOn: plant.publishedOn,
          isFavorited: plant.isFavorited,
        },
      });

      response.code(200);
    } else {
      response = h.response({
        code: 404,
        status: 'Not Found',
        message: 'Plant is not found',
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

const uploadPlant = async (request, h) => {
  const {
    name, latinName, category, wateringFreq, growthEst, desc, author,
  } = request.payload;
  let { tools, materials, steps } = request.payload;
  let response = '';

  try {
    // Convert tools, materials, and steps to be array
    tools = tools.split(', ');
    materials = materials.split(', ');
    steps = steps.split(', ');

    response = h.response({
      code: 201,
      status: 'Created',
      data: {
        name,
        latinName,
        category,
        wateringFreq,
        growthEst,
        desc,
        tools,
        materials,
        steps,
        author,
      },
    });

    response.code(201);
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

module.exports = { getPlants, getPlantDetails, uploadPlant };
