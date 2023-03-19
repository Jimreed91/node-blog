const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const helper = require('./blogTestHelper');
const initialBlogs = [helper.blogs[0], helper.blogs[1]];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(helper.blogs[0]);
  await blogObject.save();
  blogObject = new Blog(helper.blogs[1]);
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
    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test('blogs identified by \'id\'', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
  });
});

describe('valid blogs can be added to the db', () => {
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

describe('invalid blogs cannot be saved', () => {
  test('blog with missing title cannot be created', async () => {
    const newBlog = {
      author: 'Cartoon Foxes',
      url: 'https://why.com/',
      likes: 7,
    };
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(400);
  });
  test('blog with missing url cannot be created', async () => {
    const newBlog = {
      title: 'Something valid',
      author: 'Cartoon Foxes',
      likes: 7,
    };
    await api.post('/api/blogs')
      .send(newBlog)
      .expect(400);
  });
});

describe('blogs can be deleted', () => {
  test('returns status 204 if valid', async () => {
    const response = await api.get('/api/blogs');
    const blogs = response.body;
    const blogToDelete = blogs[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);
    const remainingBlogs = await api.get('/api/blogs');
    expect(remainingBlogs.body).toHaveLength(
      blogs.length - 1,
    );
  });
});

describe('blogs can be edited', () => {
  test('with valid attributes a blog is updated', async () => {
    const response = await api.get('/api/blogs');
    const blogs = response.body;
    const blogToUpdate = blogs[0];
    const updatedBlog = {
      title: blogs[0].title,
      author: blogs[0].author,
      url: blogs[0].author,
      likes: 100,
    };
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200);
    const updated = await api.get('/api/blogs');
    const returnedBlog = updated.body;
    expect(returnedBlog[0].likes).toBe(100);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
