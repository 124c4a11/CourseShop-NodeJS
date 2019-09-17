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


router.get('/:id', async (req, res) => {
  const course = await Course.getById(req.params.id);

  res.render('course', {
    title: course.title,
    course
  });
});


module.exports = router;
