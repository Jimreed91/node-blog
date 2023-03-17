// This file just imports and runs the express app
// Separating the app from the code running the server allows for
// testing the app without running the server

const app = require('./app');
const config = require('./utils/config');
const { info } = require('./utils/logger');

console.log(config.PORT);
app.listen(config.PORT, () => {
  info(`Server running on port ${config.PORT}`);
});
