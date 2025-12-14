const Hapi = require('@hapi/hapi');
require('dotenv').config();

// Authentication
const authRoutes = require('./routes/auth');

// Cities (for leaderboard etc)
const { cityRoutes, cityAssignmentTracker } = require('./routes/cities');

// Predictions
const predictionRoutes = require('./routes/predictions');
const { LoadModel } = require('./models/ml-model');

// Leaderboards
const leaderboardRoutes = require('./routes/leaderboard');

const init = async () => {
  await LoadModel();
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
        credentials: true,
      },
    },
  });

  await cityAssignmentTracker.initialize();

  server.route(authRoutes);
  server.route(cityRoutes);
  server.route(predictionRoutes);
  server.route(leaderboardRoutes);

  server.route({
    method: 'GET',
    path: '/',
    handler: () => {
      return { status: 'Server is running', version: '1.0.0' };
    },
  });

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();