const { Router } = require('express');
const router = Router();
const { courseValidators } = require('../utils/validators');
const { validationResult } = require('express-validator');

const auth = require('../middleware/auth');

const Course = require('../models/Course');


router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Add course',
    isAdd: true,
    data: {
      title: '',
      price: '',
      img: ''
    }
  });
});


router.post('/', auth, courseValidators, async (req, res) => {
  const {
    title,
    price,
    img,
  } = req.body;


  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: 'Add course',
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        title,
        price,
        img
      }
    });
  }

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
