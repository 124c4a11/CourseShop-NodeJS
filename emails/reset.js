require('dotenv').config();


module.exports = function(email, token) {
  return {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'Restore password',
    html: `<p><a href="${process.env.BASE_URL}/auth/reset/${token}">Restore password</a></p>`
  };
};
