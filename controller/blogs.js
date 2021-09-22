const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) =>
{
  const blogs = await Blog.find({});
  response.json(blogs);
})

blogsRouter.post('/', async (request, response) =>
{
  const body = request.body;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes | 0
  });
  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
})

blogsRouter.delete('/:id', async (request, response) =>
{
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
})

blogsRouter.put('/:id', async (request, response) =>
{
  const body = request.body;
  // allow update those attr except title
  const newOb = { author: body.author, url: body.url, likes: body.likes };
  const returnedBlog = await Blog.findByIdAndUpdate(request.params.id, newOb, { new: true, runValidators: true });
  response.json(returnedBlog);
})

module.exports = blogsRouter;
