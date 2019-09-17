const { Router } = require('express');
const router = Router();


router.get('/', (req, res) => {
  res.render('index', {
    title: 'Home Page',
    message: 'Welcome to course shop!',
    isHome: true
  });
});


module.exports = router;
