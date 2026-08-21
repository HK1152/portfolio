const express = require('express');
const router = express.Router();
const { sendContactMessage } = require('./contact.controller');
const { validateContactInput } = require('./contact.validator');

router.post('/', validateContactInput, sendContactMessage);

module.exports = router;
