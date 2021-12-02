const { register } = require('./handler/identity');

const routes = [
  // Register
  {
    method: 'POST',
    path: '/register',
    handler: register,
  },
];

module.exports = routes;
