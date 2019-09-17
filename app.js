const express = require('express');
const path = require('path');


const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');


const app = express();
app.set('view engine', 'pug');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);


module.exports = app;
