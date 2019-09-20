const { Router } = require('express');
const router = Router();

const Course = require('../models/Course');


router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();

    res.render('courses', {
      title: 'Courses',
      courses,
      isCourses: true
    });
  } catch (err) {
    console.error(err);
  }
});


router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    res.render('course', {
      title: course.title,
      course
    });
  } catch (err) {
    console.error(err);
  }
});


router.get('/:id/edit', async (req, res) => {
  if (!req.query.allow) return res.redirect('/');

  try {
    const course = await Course.findById(req.params.id);

    res.render('course-edit', {
      title: 'Course edit',
      course
    });
  } catch (err) {
    console.error(err);
  }
});


router.post('/edit', async (req, res) => {
  const { id } = req.body;

  delete req.body.id;

  try {
    await Course.findByIdAndUpdate(id, req.body);

    res.redirect('/courses');
  } catch (err) {
    console.error(err);
  }
});


module.exports = router;
