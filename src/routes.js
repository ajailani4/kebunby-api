const { register, login } = require('./handler/identity-handler');
<<<<<<< HEAD
const { getPlants, getPlantDetails, uploadPlant } = require('./handler/plant-handler');
const { getPlantsByUsername } = require('./handler/user-handler');
=======
const {
  getPlants, getPlantDetails, uploadPlant, updatePlant, deletePlant,
} = require('./handler/plant-handler');
const { getPlantsByCategoryId } = require('./handler/category-handler');
>>>>>>> 1b9d8899f1b46c3939b5b0e5c90aeb7fe8128f74

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
<<<<<<< HEAD

  {
    method: 'GET',
    path: `${prefix}/users/{username}/plants`,
    config: { auth: 'jwt' },
    handler: getPlantsByUsername,
  },

=======
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
>>>>>>> 1b9d8899f1b46c3939b5b0e5c90aeb7fe8128f74
];


module.exports = routes;