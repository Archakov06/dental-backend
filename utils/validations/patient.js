const { check } = require('express-validator');

const validation = {
  create: [
    check('fullname').isLength({ min: 6 }),
    check('phone').isLength({ min: 11 })
  ]
};

module.exports = validation;
