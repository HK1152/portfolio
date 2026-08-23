const Joi = require('joi');

exports.contactSchema = Joi.object({
  name: Joi.string().max(100).required().messages({
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  message: Joi.string().max(5000).required().messages({
    'string.max': 'Message cannot exceed 5000 characters',
    'any.required': 'Message is required'
  })
});
