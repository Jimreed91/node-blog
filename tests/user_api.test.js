const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const bcrypt = require('bcrypt');
const User = require('../models/user');
const helper = require('./user_test_helper');

describe('when there is an initial user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('secret', 10);
    const user = new User({ username: 'test', passwordHash });

    await user.save();
  });

  test('a new user can be created', async () => {
    const usersBefore = await helper.usersInDb();

    const newUser = {
      username: 'Chiuahua1',
      name: 'Rin',
      password: 'dogpassword',
    };

    await api.post('/api/users')
      .send(newUser)
      .expect(201);

    const usersAfter = await helper.usersInDb();
    expect(usersAfter.length).toBe(usersBefore.length + 1);

    const userNames = usersAfter.map((user) => user.name);
    expect(userNames).toContain(newUser.name);
  });
});
