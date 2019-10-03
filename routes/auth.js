const bcrypt = require('bcryptjs');
const { Router } = require('express');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const router = Router();

const User = require('../models/User');

const regEmail = require('../emails/registration');



require('dotenv').config()


const transporter = nodemailer.createTransport(sendgrid({
  auth: { api_key: process.env.SENDGRID_API_KEY },
}));


router.get('/', (req, res) => {
  res.render('login', {
    title: 'Authorization',
    isLogin: true,
    loginError: req.flash('loginError'),
    registerError: req.flash('registerError')
  });
});


router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth');
  });
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);

      if (areSame) {
        req.session.user = candidate;
        req.session.isAuth = true;
        req.session.save((err) => {
          if (err) throw err;

          res.redirect('/');
        });
      } else {
        req.flash('loginError', 'This user does not exist.');
        res.redirect('/auth#login');
      }
    } else {
      req.flash('loginError', 'This user does not exist.');
      res.redirect('/auth#login');
    }
  } catch (err) {
    console.error(err);
  }
});


router.post('/register', async (req, res) => {
  try {
    const { email, name, password, repeat } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      req.flash('registerError', 'User with such email already exists');

      return res.redirect('/auth#register');
    }

    const hashPasword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      name,
      password: hashPasword,
      cart: { items: [] }
    });

    await user.save();

    await transporter.sendMail(regEmail(email));

    res.redirect('/auth#login');
  } catch (err) {
    console.error(err);
  }
});


module.exports = router;
