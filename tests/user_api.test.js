const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const api = supertest(app);

const User = require('../models/user');
const helper = require('./user_test_helper');

describe('when there are initial users in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    let passwordHash = await bcrypt.hash('secret', 10);
    let user = new User({ username: 'test', passwordHash });
    passwordHash = await bcrypt.hash('secret', 10);
    user = new User({ username: 'test1', passwordHash });

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

  test('create fails if username invalid, returning 400', async () => {
    // no username
    const invalidUsername = {
      name: 'Rin',
      password: 'dogpassword',
    };
    await api.post('/api/users')
      .send(invalidUsername)
      .expect(400);
    // username less than 3 chars
    invalidUsername.username = 'Ch';
    await api.post('/api/users')
      .send(invalidUsername)
      .expect(400);
  });

  test('create fails if username is not unique, returning 400', async () => {
    const passwordHash = await bcrypt.hash('secret', 10);
    const users = await helper.usersInDb();
    const duplicateUser = new User({ username: 'test1', passwordHash });
    expect(users[0].username).toBe(duplicateUser.username);

    await api.post('/api/users')
      .send(duplicateUser)
      .expect(400);
  });

  test('GET users returns a list of users in json', async () => {
    await api.get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
