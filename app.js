const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const csurf = require('csurf');
const flash = require('connect-flash');
const helmet = require('helmet');
const compression = require('compression');

const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);

const varsMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');
const pageNotFound = require('./middleware/error');
const fileMiddleware = require('./middleware/file');

const homeRoutes = require('./routes/home');
const addRoutes = require('./routes/add');
const coursesRoutes = require('./routes/courses');
const cartRoutes = require('./routes/cart');
const ordersRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');


require('dotenv').config();


const app = express();
app.set('view engine', 'pug');


const store = new MongoStore({
  collection: 'sessions',
  uri: process.env.DB
});


app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store
}));
app.use(fileMiddleware.single('avatar'));
app.use(csurf());
app.use(flash());
app.use(helmet());
app.use(compression());
app.use(varsMiddleware);
app.use(userMiddleware);


app.use('/', homeRoutes);
app.use('/add', addRoutes);
app.use('/courses', coursesRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use(pageNotFound);


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
