const User = require('../models/User');


module.exports = async function(req, res, next) {
  const { user } = req.session

  if (!user) return next();

  req.user = await User.findById(user._id);

  next();
};
