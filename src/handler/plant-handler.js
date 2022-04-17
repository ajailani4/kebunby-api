const pool = require('../config/db-config');
const { uploadImage, deleteImage } = require('../util/cloudinary-util');
const { isUserActivityExist } = require('../util/user-util');
const { getPlantCategory } = require('../util/category-util');

const getPlants = async (request, h) => {
  let { page, size } = request.query;
  const { isTrending, searchQuery } = request.query;
  const { username } = request.auth.credentials;
  let response = '';
  let result = '';

  try {
    page = page || 1;
    size = size || 10;

    // Get all plants
    if ((!isTrending || isTrending === 'false') && !searchQuery) {
      result = await pool.query(
        'SELECT * FROM public."plant" ORDER BY published_on DESC OFFSET $1 LIMIT $2',
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

    // Get plants by search query
    if (searchQuery) {
      result = await pool.query(
        `SELECT * FROM public."plant" WHERE name ILIKE '%${searchQuery}%' ORDER BY published_on DESC OFFSET $1 LIMIT $2`,
        [(page - 1) * size, size],
      );
    }

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
          publishedOn: plant.published_on.toISOString().split('T')[0],
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
    name,
    latinName,
    category,
    wateringFreq,
    growthEst,
    desc,
    author,
  } = request.payload;
  let {
    image, tools, materials, steps,
  } = request.payload;
  let response = '';

  try {
    // Upload image to Cloudinary
    const uploadImageResult = await uploadImage('plant_images', image);
    image = uploadImageResult.url;

    // Convert tools, materials, and steps to be array
    tools = tools.split(', ');
    materials = materials.split(', ');
    steps = steps.split(', ');

    const publishedOn = new Date().toISOString().slice(0, 10);

    // Insert new plant to database
    const result = await pool.query(
      'INSERT INTO public."plant" (name, latin_name, image, category, watering_freq, growth_est, "desc", tools, materials, steps, popularity, author, published_on) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *',
      [
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

const isPlantExist = async (id) => {
  let isExist = false;

  try {
    const result = await pool.query(
      'SELECT * FROM public."plant" WHERE id=$1',
      [id],
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

const updatePlant = async (request, h) => {
  const { id } = request.params;
  const {
    name,
    latinName,
    category,
    wateringFreq,
    growthEst,
    desc,
    popularity,
    author,
    publishedOn,
  } = request.payload;
  let {
    image, tools, materials, steps,
  } = request.payload;
  let result = '';
  let response = '';

  try {
    if (await isPlantExist(id)) {
      // Convert tools, materials, and steps to be array
      tools = tools.split(', ');
      materials = materials.split(', ');
      steps = steps.split(', ');

      // Update plant from database
      if (image.length > 0) {
        // If plant image is changed
        const uploadImageResult = await uploadImage('plant_images', image);
        image = uploadImageResult.url;

        result = await pool.query(
          'UPDATE public."plant" SET "name"=$1, latin_name=$2, image=$3, category=$4, watering_freq=$5, growth_est=$6, "desc"=$7, tools=$8, materials=$9, steps=$10, popularity=$11, author=$12, published_on=$13 WHERE id=$14',
          [
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
            popularity,
            author,
            publishedOn,
            id,
          ],
        );
      } else {
        // If plant image is not changed
        result = await pool.query(
          'UPDATE public."plant" SET "name"=$1, latin_name=$2, category=$3, watering_freq=$4, growth_est=$5, "desc"=$6, tools=$7, materials=$8, steps=$9, popularity=$10, author=$11, published_on=$12 WHERE id=$13',
          [
            name,
            latinName,
            category,
            wateringFreq,
            growthEst,
            desc,
            tools,
            materials,
            steps,
            popularity,
            author,
            publishedOn,
            id,
          ],
        );
      }

      if (result) {
        response = h.response({
          code: 200,
          status: 'OK',
          message: 'Plant has been edited successfully',
        });

        response.code(200);
      } else {
        response = h.response({
          code: 500,
          status: 'Internal Server Error',
          message: 'Plant cannot be edited',
        });

        response.code(500);
      }
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

const deletePlant = async (request, h) => {
  const { id } = request.params;
  let result = '';
  let response = '';

  try {
    if (await isPlantExist(id)) {
      // Get image url
      result = await pool.query(
        'SELECT image FROM public."plant" WHERE id=$1',
        [id],
      );

      // Delete plant image from Cloudinary
      const pathNames = result.rows[0].image.split('/');
      const publicId = `${pathNames[pathNames.length - 2]}/${pathNames[pathNames.length - 1]}`.split('.')[0];
      await deleteImage(publicId);

      // Delete plant from database
      result = await pool.query(
        'DELETE FROM public."plant" WHERE id=$1',
        [id],
      );

      if (result) {
        response = h.response({
          code: 200,
          status: 'OK',
          message: 'Plant has been deleted',
        });

        response.code(200);
      } else {
        response = h.response({
          code: 500,
          status: 'Internal Server Error',
          message: 'Plant cannot be deleted',
        });

        response.code(500);
      }
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

module.exports = {
  getPlants,
  getPlantDetails,
  uploadPlant,
  updatePlant,
  deletePlant,
};
