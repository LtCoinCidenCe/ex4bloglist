const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () =>
{
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map(b => new Blog(b));
  const promiseArray = blogObjects.map(b => b.save());
  const results = await Promise.all(promiseArray);
});

describe('exercise 4.8', () =>
{
  test('application returns the correct amount of blog posts', async () =>
  {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
});

describe('exercise 4.9', () =>
{
  test('unique identifier is named id', async () =>
  {
    const response = await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const allBlogs = response.body;
    for (let i = 0; i < allBlogs.length; i++)
    {
      const element = allBlogs[i];
      expect(element.id).toBeDefined();
    }
  })
})

describe('exercise 4.10', () =>
{
  test('HTTP POST makes a new blog post', async () =>
  {
    const newBlog = {
      title: "Advance wars",
      author: "Nitendo",
      url: "https://www.youtube.com/watch?v=fftL_XeK2qU",
      likes: 3
    };

    const response = await api.post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    let theNewBlog = blogsAtEnd.pop();
    delete theNewBlog.id;
    expect(theNewBlog).toEqual(newBlog);
  })
});

afterAll(() =>
{
  mongoose.connection.close();
});
