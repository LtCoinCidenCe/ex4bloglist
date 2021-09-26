const bcrypt = require('bcrypt');
const User = require('../models/user');
const userRouter = require('express').Router();

userRouter.get('/', async (request, response) =>
{
  const users = await User.find({});
  response.json(users);
})

userRouter.post('/', async (request, response) =>
{
  // fields are username, name, password
  const body = request.body;

  const saltRounds = 5;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash: passwordHash
  });

  const savedUser = await user.save();
  response.json(savedUser);
})

module.exports = userRouter;
