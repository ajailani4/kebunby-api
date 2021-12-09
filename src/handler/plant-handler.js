const pool = require('../config/db-config');
const { uploadImage } = require('../util/cloudinary-util');

const getPlants = async(request, h) => {
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
        'SELECT * FROM public."plant" OFFSET $1 LIMIT $2', [(page - 1) * size, size],
      );
    }

    // Get trending plants
    if (isTrending === 'true') {
      result = await pool.query(
        'SELECT * FROM public."plant" ORDER BY popularity DESC OFFSET $1 LIMIT $2', [(page - 1) * size, size],
      );
    }

    // Get plants by category
    if (category) {
      result = await pool.query(
        'SELECT * FROM public."plant" WHERE category=$1 OFFSET $2 LIMIT $3', [category, (page - 1) * size, size],
      );
    }

    // Get plants by search query
    if (searchQuery) {
      result = await pool.query(
        `SELECT * FROM public."plant" WHERE name ILIKE '%${searchQuery}%' OFFSET $1 LIMIT $2`, [(page - 1) * size, size],
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

const getPlantDetails = async(request, h) => {
  const { id } = request.params;
  let response = '';

  try {
    const result = await pool.query(
      'SELECT * FROM public."plant" WHERE id=$1', [id],
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

const uploadPlant = async(request, h) => {
  const {
    name,
    latinName,
    wateringFreq,
    growthEst,
    desc,
    author,
  } = request.payload;
  let {
    image,
    category,
    tools,
    materials,
    steps,
  } = request.payload;
  let response = '';

  try {
    const uploadImageResult = await uploadImage('plant_images', image);
    image = uploadImageResult.url;

    category = Number(category);

    // Convert tools, materials, and steps to be array
    tools = tools.split(', ');
    materials = materials.split(', ');
    steps = steps.split(', ');

    const publishedOn = new Date().toISOString().slice(0, 10);

    const result = await pool.query(
      'INSERT INTO public."plant" (name, latin_name, image, category, watering_freq, growth_est, "desc", tools, materials, steps, popularity, author, published_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *', [
        name,
        latinName,
        image,
        category,
        wateringFreq,
        growthEst,
        desc,
        tools,
        materials,
        steps,
        0,
        author,
        publishedOn,
      ],
    );

    if (result) {
      response = h.response({
        code: 201,
        status: 'Created',
        message: 'New plant has been added successfully',
      });

      response.code(201);
    } else {
      response = h.response({
        code: 500,
        status: 'Internal Server Error',
        message: 'New plant cannot be added',
      });

      response.code(500);
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

module.exports = { getPlants, getPlantDetails, uploadPlant };