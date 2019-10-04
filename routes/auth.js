const bcrypt = require('bcryptjs');
const { Router } = require('express');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const router = Router();

const User = require('../models/User');

const regEmail = require('../emails/registration');
const resetEmail = require('../emails/reset');



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


router.get('/reset', (req, res) => {
  res.render('reset', {
    title: 'Restore password',
    error: req.flash('restetError')
  });
});


router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('loginError', 'Something went wrong try again later');

        return res.redirect('/auth');
      }

      const token = buffer.toString('hex');
      const candidate = await User.findOne({ email: req.body.email });

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 3600000;

        await candidate.save();

        await transporter.sendMail(resetEmail(candidate.email, token));

        res.redirect('/auth');
      } else {
        req.flash('loginError', 'User with specified email is not registered');

        res.redirect('/auth');
      }
    });
  } catch (err) {
    console.error(err);
  }
});


module.exports = router;
