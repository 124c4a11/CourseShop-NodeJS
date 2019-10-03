require('dotenv').config();


module.exports = function(email) {
  return {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'Account is created',
    html: `<h1>Welcome to Course Shop</h1>`
  };
};
