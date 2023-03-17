const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const testBlogs = require('./testBlogs');
const initialBlogs = [testBlogs[0], testBlogs[1]];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(testBlogs.blogs[0]);
  await blogObject.save();
  blogObject = new Blog(testBlogs.blogs[1]);
  await blogObject.save();
});

describe('when blogs present in db', () => {
  test('blogs are returned in json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    console.log(response.body);
    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test('blogs identified by \'id\'', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
