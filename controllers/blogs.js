// controller for blogs
// instead of app.get, app.post, etc. we use router.get, router.post, etc.

const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const blog = await new Blog(request.body);

  const newBlog = await blog.save();
  response.status(201).json(newBlog);
});

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndRemove(req.params.id);
  res.status(204).end();
});

module.exports = blogsRouter;
