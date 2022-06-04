const { register, login } = require('./handler/identity-handler');
const {
  getPlants,
  getPlantDetail,
  uploadPlant,
  updatePlant,
  deletePlant,
} = require('./handler/plant-handler');
const { getPlantsByCategoryId, getPlantCategories } = require('./handler/category-handler');
const {
  getPlantActivities,
  addPlantActivity,
  deletePlantActivity,
  getUserProfile,
} = require('./handler/user-handler');

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
    handler: getPlantDetail,
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
  // Get User Activity
  {
    method: 'GET',
    path: `${prefix}/users/{username}/plants`,
    config: { auth: 'jwt' },
    handler: getPlantActivities,
  },
  // Add User Activity
  {
    method: 'POST',
    path: `${prefix}/users/{username}/plants`,
    config: { auth: 'jwt' },
    handler: addPlantActivity,
  },
  // Delete User Activity
  {
    method: 'DELETE',
    path: `${prefix}/users/{username}/plants/{plantId}`,
    config: { auth: 'jwt' },
    handler: deletePlantActivity,
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
