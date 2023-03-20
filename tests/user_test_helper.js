const User = require('../models/user');

const users = [
  {
    username: 'user1',
    name: 'Blix',
  },
  {
    username: 'user2',
    name: 'Ralph',
  },
];

const usersInDb = async () => {
  const dbBlogs = await User.find({});
  return dbBlogs.map((blog) => blog.toJSON());
};

module.exports = {
  users,
  usersInDb,
};
