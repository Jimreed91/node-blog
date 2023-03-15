const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./utils/config');
const { info, error } = require('./utils/logger');

const app = express();
const blogsRouter = require('./controllers/blogs');

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    info('connected to MongoDB');
  })
  .catch((e) => {
    error('encountered error connecting to mongoDB', e.message);
  });

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);

module.exports = app;
