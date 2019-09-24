const { Router } = require('express');
const router = Router();


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
  req.session.isAuth = true;
  res.redirect('/');
});


module.exports = router;
