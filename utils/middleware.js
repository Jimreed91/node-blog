const logger = require('./logger');
const jwt = (require('jsonwebtoken'));
const User = require('../models/user');

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (!authorization) {
    response.status(401).json({ error: 'no auth token in headers' })
  }
  if (authorization && authorization.startsWith('Bearer ')) {
    authorization.replace('Bearer ', '');
  }
  const token = jwt.verify(authorization, process.env.SECRET);
  if (!token.id) {
    response.status(401).json({ error: 'token invalid' });
  }
  request.token = token;
  next();
};

const userExtractor = async (request, response, next) => {
  const user = await User.findById(request.token.id);
  request.user = user;
  next();
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired',
    });
  }

  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
