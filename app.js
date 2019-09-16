const express = require('express');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');


const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');


const app = express();
app.set('view engine', 'pug');


app.use(sassMiddleware({
  src: path.join(__dirname, 'scss'),
  dest: path.join(__dirname, 'public', 'css'),
  debug: true,
  outputStyle: 'compressed',
  prefix: '/css'
}));

app.use(express.static(path.join(__dirname, 'public')));


app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);


module.exports = app;
