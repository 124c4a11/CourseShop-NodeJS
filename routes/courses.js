const { Router } = require('express');
const router = Router();


router.get('/', (req, res) => {
  res.render('courses', {
    title: 'Courses',
    message: 'Courses',
    isCourses: true
  });
});


module.exports = router;
