const { Router } = require('express');
const router = Router();

const Course = require('../models/Course');


function mapCartItems(cart) {
  return cart.items.map((item) => ({
    ...item.courseId._doc,
    count: item.count
  }));
}


function coumputePrice(courses) {
  return courses.reduce((total, { price, count }) => {
    return total += price * count;
  }, 0);
}


router.get('/', async (req, res) => {
  const user = await req.user
    .populate('cart.items.courseId')
    .execPopulate('');

  const courses = mapCartItems(user.cart);

  res.render('cart', {
    title: 'Cart',
    isCart: true,
    courses,
    price: coumputePrice(courses)
  });
});


router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id);

  await req.user.addToCart(course);

  res.redirect('/cart');
});


router.delete('/remove/:id', async (req, res) => {
  const cart = await Cart.remove(req.params.id);

  res.status(200).json(cart);
});


module.exports = router;
