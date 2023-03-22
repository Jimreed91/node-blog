// controller for blogs

const jwt = (require('jsonwebtoken'));
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .find({}).populate('user', { username: 1, name: 1, id: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const blog = await new Blog(request.body);

  const user = await User.findById(request.token.id);
  blog.user = user.id;

  const newBlog = await blog.save();
  user.blogs = user.blogs.concat(newBlog._id);
  await user.save();

  response.status(201).json(newBlog);
});

blogsRouter.put('/:id', async (req, res) => {
  const { body } = req;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  await Blog.findByIdAndUpdate(req.params.id, blog, { new: true });
  res.status(200).json(blog);
});

blogsRouter.delete('/:id', async (req, res) => {
  const user = await User.findById(req.token.id);
  const blog = await Blog.findById(req.params.id);

  if (user.id !== blog.user.toString()) {
    return res.status(400).json(
      {
        error: 'users can only delete their own blogs',
      },
    );
  };
  await Blog.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

module.exports = blogsRouter;
