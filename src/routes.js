const { register, login } = require('./handler/identity-handler');
const {
  getPlants,
  getPlantDetails,
  uploadPlant,
  updatePlant,
  deletePlant,
} = require('./handler/plant-handler');
const { getPlantsByCategoryId, getPlantCategories } = require('./handler/category-handler');
const { getPlantsByUsername, getUserProfile } = require('./handler/user-handler');

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
  // Get Plants (All Plants, Trending Plants, and Plants by Search Query)
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

  // Get Plants by Username
  {
    method: 'GET',
    path: `${prefix}/users/{username}/plants`,
    config: { auth: 'jwt' },
    handler: getPlantsByUsername,
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
  // Update Plant
  {
    method: 'PUT',
    path: `${prefix}/plants/{id}`,
    config: {
      auth: 'jwt',
      payload: {
        multipart: true,
      },
    },
    handler: updatePlant,
  },
  // Delete Plant
  {
    method: 'DELETE',
    path: `${prefix}/plants/{id}`,
    config: { auth: 'jwt' },
    handler: deletePlant,
  },
  // Get Plants by Category
  {
    method: 'GET',
    path: `${prefix}/categories/{id}/plants`,
    config: { auth: 'jwt' },
    handler: getPlantsByCategoryId,
  },
  // Get Plants Categories
  {
    method: 'GET',
    path: `${prefix}/categories`,
    config: { auth: 'jwt' },
    handler: getPlantCategories,
  },

  // Get User Profile
  {
    method: 'GET',
    path: `${prefix}/users/{username}`,
    config: { auth: 'jwt' },
    handler: getUserProfile,
  },
];

module.exports = routes;