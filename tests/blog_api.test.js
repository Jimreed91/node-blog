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

describe('new blogs can be added to the db', () => {
  test('a valid blog is added to the db', async () => {
    const newBlog = {
      title: 'Whys Poignant Guide',
      author: 'Cartoon Foxes',
      url: 'https://why.com/',
      likes: 9,
    };
    // testing for expected response
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    // testing for change to database
    const response = api.get('/api/blogs');
    const authors = (await response).body.map((blog) => blog.author);
    expect(authors).toContain(newBlog.author);
  });

  test('a valid blog with no likes defaults to 0 likes', async () => {
    const newBlog = {
      title: 'Whys Poignant Guide',
      author: 'Cartoon Foxes',
      url: 'https://why.com/',
    };
    // expect blog to be added without likes defined
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(201);
    // checking for likes: 0 in newly added blog
    const response = await api.get('/api/blogs');
    expect(response.body[2].likes).toBe(0);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
