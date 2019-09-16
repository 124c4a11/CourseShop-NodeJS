const { Router } = require('express');
const router = Router();


router.get('/', (req, res) => {
  res.render('add', {
    title: 'Add course',
    message: 'Add course page',
    isAdd: true
  });
});


module.exports = router;
