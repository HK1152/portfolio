const express = require('express');
const cors = require('cors');
const env = require('./app/config/env.config');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { globalLimiter } = require('./app/middleware/rateLimiter.middleware');
const { xssSanitize } = require('./app/middleware/sanitize.middleware');
const { csrfProtection } = require('./app/middleware/csrf.middleware');
const appRouter = require('./app/routes');
const errorHandler = require('./app/middleware/error.middleware');
const notFoundHandler = require('./app/middleware/notFound.middleware');

const app = express();

// Security & Core Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false, // allow static files to be served cross-origin if needed
}));

app.use(
  cors({
    origin: env.CLIENT_URL === '*' ? true : env.CLIENT_URL.split(',').map((url) => url.trim()),
    credentials: true,
  })
);

app.use(globalLimiter); // Apply global rate limiting
app.use(cookieParser()); // Parse cookies
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.pdf')) {
      const date = new Date();
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
      const dynamicName = `kavya-patel-CV(Download-${day}${month}).pdf`;
      res.setHeader('Content-Disposition', `attachment; filename="${dynamicName}"`);
    }
  }
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(xssSanitize); // Sanitize inputs
app.use(csrfProtection); // Protect against CSRF

// Base API Router
app.use('/api', appRouter);

// 404 & Global Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
// Trigger restart for Prisma client update
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
