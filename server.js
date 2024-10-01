// Import necessary modules
const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const ApiError = require('./utils/apiError');
const globalError = require('./middlewares/errorMiddleware');
const dbConnection = require('./config/database');

// Load environment variables from config.env file
dotenv.config({ path: 'config.env' });

// Import Routes
const User = require('./routes/authuser');
const Vole = require('./routes/vole');
const VoleMain = require('./routes/voleMain');

// Connect with the database
dbConnection();

// Initialize the express app
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS for cross-origin requests
app.use(cors());
app.options('*', cors()); // Enable CORS pre-flight for all routes

// Enable compression for responses
app.use(compression());

// Serve static files from the 'uploads' directory
app.use(express.static(path.join(__dirname, 'uploads')));

// Use morgan for logging requests in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`Running in development mode`);
}

// Define routes
app.get('/api/s', (req, res) => {
  console.log('Endpoint hit');
  res.send("dzdzdz");
});

// Mount API routes
app.use('/api/vole', Vole);
app.use('/api/voleMain', VoleMain);
app.use('/api/user', User);

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware
app.use(globalError);

// Define the port to listen on, defaulting to 8000
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error('Shutting down the server due to unhandled rejection...');
    process.exit(1); // Exit with a failure status
  });
});
