const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const dns = require('dns');
const connectDB = require('./config/db');
const portfolioRoutes = require('./routes/portfolioRoutes');
const contactRoutes = require('./routes/contactRoutes');

// Fix for querySrv ECONNREFUSED on some networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/contact', contactRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
