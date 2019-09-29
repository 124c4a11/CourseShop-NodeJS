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
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      const areSame = password === candidate.password;

      if (areSame) {
        req.session.user = candidate;
        req.session.isAuth = true;
        req.session.save((err) => {
          if (err) throw err;

          res.redirect('/');
        });
      } else {
        res.redirect('/auth#login');
      }
    } else {
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

    if (candidate) return res.redirect('/auth#register');

    const user = new User({ email, name, password, cart: { items: [] } });

    await user.save();

    res.redirect('/auth#login');
  } catch (err) {
    console.error(err);
  }
});


module.exports = router;
