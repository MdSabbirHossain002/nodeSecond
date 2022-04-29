const { check, validationResult } = require("express-validator");
const doLoginValidators = [
    check("email")
      .isLength({
        min: 1,
      })
      .withMessage("Username or email is required"),
    check("password").isLength({ min: 1 }).withMessage("Password is required"),
  ];

const doLoginValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
module.exports = {
    doLoginValidators,
    doLoginValidationHandler,
};  