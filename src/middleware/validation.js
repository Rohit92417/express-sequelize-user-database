const { body, validationResult } = require('express-validator')
const userValidationRules = () => {
  return [
    // username 
    body('user_name').notEmpty().withMessage("name is not empty").isLength({min:3}).withMessage("name must be 3 character"),
    //User Email
    body('user_email').isEmail().withMessage("Invalid email address"),
    // password must be at least 5 chars long
    body('user_password').isLength({ min: 8 }).withMessage("Password must be 8 character"),
    
    body('total_orders').notEmpty().isNumeric().withMessage("enter  Value"),
    

  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {
  userValidationRules,
  validate,
}