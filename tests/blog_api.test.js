const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper=require('./test_helper');

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


afterAll(() =>
{
  mongoose.connection.close();
});
