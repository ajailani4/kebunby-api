const { register, login } = require('./handler/identity-handler');
const { getPlants, getPlantDetails, uploadPlant } = require('./handler/plant-handler');
const { getPlantsByCategoryId } = require('./handler/category-handler');

const prefix = '/api/v1';

const routes = [
  // Register
  {
    method: 'POST',
    path: `${prefix}/register`,
    config: { auth: false },
    handler: register,
  },
  // Login
  {
    method: 'POST',
    path: `${prefix}/login`,
    config: { auth: false },
    handler: login,
  },
  // Get Plants (All Plants, Trending Plants, Plants by Category, Plants by Search Query)
  {
    method: 'GET',
    path: `${prefix}/plants`,
    config: { auth: 'jwt' },
    handler: getPlants,
  },
  // Get Plant Details
  {
    method: 'GET',
    path: `${prefix}/plants/{id}`,
    config: { auth: 'jwt' },
    handler: getPlantDetails,
  },
  // Upload Plant
  {
    method: 'POST',
    path: `${prefix}/plants`,
    config: {
      auth: 'jwt',
      payload: {
        multipart: true,
      },
    },
    handler: uploadPlant,
  },
  // Get Plants by Category
  {
    method: 'GET',
    path: `${prefix}/categories/{id}/plants`,
    config: { auth: 'jwt' },
    handler: getPlantsByCategoryId,
  },
];

module.exports = routes;
