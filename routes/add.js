const { Router } = require('express');
const router = Router();

const Course = require('../models/Course');


router.get('/', (req, res) => {
  res.render('add', {
    title: 'Add course',
    isAdd: true
  });
});


router.post('/', async (req, res) => {
  const {
    title,
    price,
    img
  } = req.body;

  const course = new Course({ title, price, img });

  try {
    await course.save();
    res.redirect('/courses');
  } catch (err) {
    console.error(err);
  }
});


module.exports = router;
