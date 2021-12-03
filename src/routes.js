const { register } = require('./handler/identity-handler');

const prefix = '/api/v1';

const routes = [
  // Register
  {
    method: 'POST',
    path: `${prefix}/register`,
    handler: register,
  },
];

module.exports = routes;
