const express = require('express');
const router = express.Router();
const { sendContactMessage } = require('./contact.controller');
const { contactSchema } = require('../../validators/contact.validator');
const validate = require('../../middleware/validate.middleware');

router.post('/', validate(contactSchema), sendContactMessage);

module.exports = router;
