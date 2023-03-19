const bcrypt = require('bcrypt');
const User = require('../models/user');

describe('when there is an initial user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('secret, 10');
    const user = new User({ username: 'test', passwordHash });

    await user.save();
  });

  // test('a new user can be created', async () => {
  //   const usersBefore = await helper.usersInDb
  // });
});
