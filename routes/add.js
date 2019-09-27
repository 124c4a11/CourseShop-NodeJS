const { Router } = require('express');
const router = Router();

const auth = require('../middleware/auth');

const Course = require('../models/Course');


router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Add course',
    isAdd: true
  });
});


router.post('/', auth, async (req, res) => {
  const {
    title,
    price,
    img,
  } = req.body;

  const userId = req.user;

  const course = new Course({ title, price, img, userId});

  try {
    await course.save();
    res.redirect('/courses');
  } catch (err) {
    console.error(err);
  }
});


module.exports = router;
