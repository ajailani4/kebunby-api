const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const routes = require('./routes');

const init = async () => {
  dotenv.config();

  const server = Hapi.server({
    port: 5000,
    host: 'localhost',
  });

  // Setup routes
  server.route(routes);

  // Start server
  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
};

init();
