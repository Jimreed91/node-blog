const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const { info, error } = require('./utils/logger');
const mongoose = require('mongoose');
require('express-async-errors');

const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware');

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    info('connected to MongoDB');
  })
  .catch((e) => {
    error('encountered error connecting to mongoDB', e.message);
  });

app.use(cors());
app.use(express.json());

if (!config.NODE_ENV === 'test') {
  app.use(middleware.requestLogger);
}

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);
module.exports = app;
