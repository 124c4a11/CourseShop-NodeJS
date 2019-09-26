const express = require('express');
const mongoose = require('mongoose');
const path = require('path');


const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);


const varsMiddleware = require('./middleware/variables');


const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');


require('dotenv').config();


const app = express();
app.set('view engine', 'pug');


const store = new MongoStore({
  collection: 'sessions',
  uri: process.env.DB
});


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store
}));
app.use(varsMiddleware);


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
