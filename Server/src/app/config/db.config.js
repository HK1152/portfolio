const mongoose = require('mongoose');
const env = require('./env.config');

const connectDB = async () => {
  try {
    if (!env.MONGO_URI) {
      console.warn('⚠️ MONGO_URI is not set in environment variables.');
      return;
    }
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    if (env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
