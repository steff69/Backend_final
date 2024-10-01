const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConnection = require('./config/database');

// Load environment variables
dotenv.config({ path: 'config.env' });

// Connect to the database
dbConnection();

// Initialize express app
const app = express();

// Middlewares
app.use(express.json());
app.use(compression());

// CORS configuration (allow from all origins for now, adjust in production)
const corsOptions = {
  origin: '*', // You can replace '*' with specific domains in production
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable morgan logger in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

// Test route to check server status
app.get('/api/s', (req, res) => {
  console.log('Test route hit');
  res.send('Server is running...');
});

// Routes
const User = require('./routes/authuser');
const Vole = require('./routes/vole');
const VoleMain = require('./routes/voleMain');

// Mount routes
app.use('/api/user', User);
app.use('/api/vole', Vole);
app.use('/api/voleMain', VoleMain);

// Handle unhandled routes (404 errors)
app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware
app.use(globalError);

// Start server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error('Shutting down the server due to unhandled rejection...');
    process.exit(1);
  });
});
