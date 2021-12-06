const { register, login } = require('./handler/identity-handler');
const { getPlants, getPlantDetails, uploadPlant } = require('./handler/plant-handler');

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
    config: { auth: 'jwt' },
    handler: uploadPlant,
  },
];

module.exports = routes;
