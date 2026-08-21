const dotenv = require('dotenv');
const path = require('path');

// Ensure .env is read reliably
dotenv.config({ path: path.resolve(__dirname, '../../../../Server/.env') });
dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  ADMIN_KEY: process.env.ADMIN_KEY,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  CLIENT_URL: process.env.CLIENT_URL || '*',
};

module.exports = env;
