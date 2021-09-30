const blogsRouter = require('express').Router();
const jwt=require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) =>
{
  const blogs = await Blog.find({}).populate('user', { username: true, name: true });
  response.json(blogs);
})

blogsRouter.post('/', async (request, response) =>
{
  const decodedToken=jwt.verify(request.token,process.env.SECRET);
  if (!decodedToken.id)
  {
    return response.status(401).json({ error: 'token missing or invalid' });
  }
  // find user
  const designatedUser = await User.findById(decodedToken.id);
  
  // handle blog
  const body = request.body;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes | 0,
    user: designatedUser._id // plus user for blog
  });
  const savedBlog = await blog.save();
  // modify user data
  designatedUser.blogs = designatedUser.blogs.concat(savedBlog._id);
  await designatedUser.save();

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
