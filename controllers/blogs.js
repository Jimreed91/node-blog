// controller for blogs

const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .find({}).populate('user', { username: 1, name: 1, id: 1 });
  response.json(blogs);
});

blogsRouter.post('/', userExtractor, async (request, response) => {
  const blog = await new Blog(request.body);
  const user = await request.user;
  blog.user = user.id;

  const newBlog = await blog.save();
  user.blogs = user.blogs.concat(newBlog._id);
  await user.save();

  response.status(201).json(newBlog);
});

blogsRouter.put('/:id', userExtractor, async (req, res) => {
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

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const user = await req.user;
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
