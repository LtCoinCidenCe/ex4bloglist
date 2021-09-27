const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) =>
{
  const blogs = await Blog.find({}).populate('user', { username: true, name: true });
  response.json(blogs);
})

const getRandomInt = (max) => Math.floor(Math.random() * max);

blogsRouter.post('/', async (request, response) =>
{
  const body = request.body;
  // get random user
  const allUsers = await User.find({});
  const index = getRandomInt(allUsers.length);
  const designatedUser = allUsers[index];

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
