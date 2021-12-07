const { register, login } = require('./handler/identity-handler');
const { getPlants, getPlantDetails } = require('./handler/plant-handler');
const { getPlanting } = require('./handler/user-handler');

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
  // Get Plants (Trending Plants, All Plants, Plants by Category, Plants by Searced Query)
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

  // Get Plants by username
  // Planting
  {
    method: 'GET',
    path: `${prefix}/users/{username}/plants`,
    config: { auth: 'jwt' },
    handler: getPlanting,
  },
];

module.exports = routes;