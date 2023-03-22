const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);
const User = require('../models/user');
const Blog = require('../models/blog');
const helper = require('./blog_test_helper');

const initialBlogs = [helper.blogs[0], helper.blogs[1]];
let token = null;
beforeAll(async () => {
  // creating a user
  User.deleteMany({});
  const testUser = {
    username: 'Chiuahua1',
    name: 'Rin',
    password: 'dogpassword',
  };
  await api.post('/api/users')
    .send(testUser)
    .expect(201);
  const login = await api.post('/api/login')
    .send({
      username: testUser.username,
      password: testUser.password,
    });
  token = login.body.token;
});

beforeEach(async () => {
  await Blog.deleteMany({});
  await api.post('/api/blogs')
    .set('Authorization', token)
    .send(initialBlogs[0]);
  await api.post('/api/blogs')
    .set('Authorization', token)
    .send(initialBlogs[1]);
});

describe('when blogs present in db', () => {
  test('blogs are returned in json', async () => {
    await api.get('/api/blogs')
      .set('Authorization', token)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', token);
    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test('blogs identified by \'id\'', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', token);
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
      .set('Authorization', token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    // testing for change to database
    const blogsAfter = await helper.blogsInDb();
    const authors = (blogsAfter).map((blog) => blog.author);
    expect(authors).toContain(newBlog.author);
  });

  test('a valid blog with no likes defaults to 0 likes', async () => {
    const newBlog = {
      title: 'Whys Poignant Guide',
      author: 'Cartoon Foxes',
      url: 'https://why.com/',
    };
    // expect blog to be added wi.set('Authorization', token)thout likes defined
    await api.post('/api/blogs')
      .set('Authorization', token)
      .send(newBlog)
      .expect(201);
    // checking for likes: 0 in newly added blog
    const blogsAfter = await helper.blogsInDb();
    expect(blogsAfter[2].likes).toBe(0);
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
      .set('Authorization', token)
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
      .set('Authorization', token)
      .send(newBlog)
      .expect(400);
  });
});

describe('blogs can be deleted', () => {
  test('returns status 204 if valid', async () => {
    const blogsBefore = await helper.blogsInDb();
    const blogToDelete = blogsBefore[1];
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', token)
      .expect(204);

    const remainingBlogs = await helper.blogsInDb();
    expect(remainingBlogs).toHaveLength(blogsBefore.length - 1);
  });
});

describe('blogs can be edited', () => {
  test('with valid attributes a blog is updated', async () => {
    const blogsBefore = await helper.blogsInDb();
    const blogToUpdate = blogsBefore[0];

    const amendedBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.author,
      likes: 100,
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', token)
      .send(amendedBlog)
      .expect(200);

    const blogsAfter = await helper.blogsInDb();
    const updatedBlog = blogsAfter[0];
    expect(updatedBlog.likes).toBe(100);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
