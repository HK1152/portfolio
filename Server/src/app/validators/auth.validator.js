const Joi = require('joi');

exports.loginSchema = Joi.object({
  adminId: Joi.string().required().messages({
    'any.required': 'Admin ID is required'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required'
  })
});
