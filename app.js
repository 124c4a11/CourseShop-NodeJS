const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');


const User = require('./models/User');


require('dotenv').config();


const app = express();
app.set('view engine', 'pug');


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


app.use(async (req, res, next) => {
  try {
    const user = await User.findById('5d861b7853a7a528e48a2f3c');

    req.user = user;

    next();
  } catch (err) {
    console.error(err);
  }
});


app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);


async function startDb() {
  try {
    await mongoose.connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });

  } catch (err) {
    console.error(err);
  }
}
startDb();

module.exports = app;
