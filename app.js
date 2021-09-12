const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const logger = require('./utils/logger');
const config = require('./utils/config');
const Blog = require('./models/blog');
const blogsRouter = require('./controller/blogs');

const app = express();

logger.info('connecting to database');
mongoose.connect(config.MONGODB_URI);


app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.use('/api/blogs', blogsRouter);

module.exports = app;