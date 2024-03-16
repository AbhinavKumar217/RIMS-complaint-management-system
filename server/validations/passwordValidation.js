const validator = require('validator');

const validatePassword = (password) => {
  return validator.isLength(password, { min: 8 });
};

module.exports = validatePassword;
