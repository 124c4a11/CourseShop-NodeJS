const { Router } = require('express');
const router = Router();

const auth = require('../middleware/auth');


router.get('/', auth, async (req, res) => {
  try {
    res.render('profile', {
      title: 'Profile',
      user: req.user.toObject(),
      isProfile: true
    });
  } catch (err) {
    console.error(err);
  }
});


module.exports = router;
