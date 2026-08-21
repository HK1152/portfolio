const contactService = require('./contact.service');
const ApiResponse = require('../../utils/apiResponse');
const asyncHandler = require('../../utils/asyncHandler');

/**
 * @desc    Send contact form message via email
 * @route   POST /api/contact
 * @access  Public
 */
const sendContactMessage = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  const result = await contactService.sendContactEmail({ name, email, message });
  return ApiResponse.success(res, result, 'Email sent successfully!');
});

module.exports = {
  sendContactMessage,
};
