const { body } = require('express-validator');

const User = require('../models/User');


exports.registerValidators = [
  body('email')
    .isEmail()
    .withMessage('Enter the correct email')
    .custom(async (value, { req }) => {
      try {
        const user = await User.findOne({ email: value });

        if (user) return Promise.reject('User with such email already exists');
      } catch (err) {
        console.error(err);
      }
    })
    .normalizeEmail(),

  body('name', 'Name must be at least 3 characters').isLength({ min: 3 }),

  body('password', 'Password must be at least 6 characters').isLength({ min: 6 }).isAlphanumeric(),

  body('confirm').custom((value, { req }) => {
    if (value !== req.body.password) throw new Error('Passwords must match');

    return true;
  })
];


exports.courseValidators = [
  body('title').isLength({ min: 3 }).withMessage('Minimum title length must be 3 characters'),

  body('price').isNumeric().withMessage('The price field should contain only numbers'),

  body('img', 'Enter the correct image url').isURL()
];
