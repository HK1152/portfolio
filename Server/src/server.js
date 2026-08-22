const express = require('express');
const cors = require('cors');
const env = require('./app/config/env.config');
const appRouter = require('./app/routes');
const errorHandler = require('./app/middleware/error.middleware');
const notFoundHandler = require('./app/middleware/notFound.middleware');

const app = express();

// Security & Core Middlewares
app.use(
  cors({
    origin: env.CLIENT_URL === '*' ? true : env.CLIENT_URL.split(',').map((url) => url.trim()),
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Base API Router
app.use('/api', appRouter);

// 404 & Global Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
