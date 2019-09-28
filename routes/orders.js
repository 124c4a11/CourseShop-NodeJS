const { Router } = require('express');
const router = Router();

const auth = require('../middleware/auth');

const Order = require('../models/Order');


router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ 'user.userId': req.user._id })
      .populate('user.userId');

    res.render('orders', {
      title: 'Orders',
      isOrders: true,
      orders: orders.map((order) => ({
        ...order._doc,
        price: order.courses.reduce((total, c) => {
          return total += c.course.price * c.count;
        }, 0)
      }))
    });
  } catch (err) {
    console.error(err);
  }
});


router.post('/', auth, async (req, res) => {
  try {
    const user = await req.user
      .populate('cart.items.courseId')
      .execPopulate();

    const courses = user.cart.items.map((item) => ({
      count: item.count,
      course: { ...item.courseId._doc }
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user
      },

      courses
    });

    await order.save();
    await req.user.clearCart();

    res.redirect('/orders');
  } catch (err) {
    console.error(err);
  }
});


module.exports = router;
