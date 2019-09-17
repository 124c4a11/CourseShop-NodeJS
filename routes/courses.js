const { Router } = require('express');
const router = Router();

const Course = require('../models/Course');


router.get('/', async (req, res) => {
  const courses = await Course.getAll();

  res.render('courses', {
    title: 'Courses',
    courses,
    isCourses: true
  });
});


module.exports = router;
