const { Router } = require('express');
const router = Router();


const User = require('../models/User');


router.get('/', (req, res) => {
  res.render('login', {
    title: 'Authorization',
    isLogin: true
  });
});


router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth');
  });
});


router.post('/login', async (req, res) => {
  try {
    const user = await User.findById('5d861b7853a7a528e48a2f3c');

    req.session.user = user;
    req.session.isAuth = true;
    req.session.save((err) => {
      if (err) throw err;

      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
  }
});


router.post('/register', async (req, res) => {
  try {
    const { email, name, password, repeat } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) return res.redirect('/auth#register');

    const user = new User({ email, name, password, cart: { items: [] } });

    await user.save();

    res.redirect('/auth#login');
  } catch (err) {
    console.error(err);
  }
});


module.exports = router;
