// logging extracted to a module so logging to file
// or service can be added easily
const info = (...params) => {
  console.log(...params);
};

const error = (...params) => {
  console.error(...params);
};

module.exports = {
  info, error,
};
