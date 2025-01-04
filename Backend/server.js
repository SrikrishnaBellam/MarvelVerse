const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI) // No need for deprecated options
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process on connection failure
  });

// Importing routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes); // API routes

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all route to serve frontend files (must be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global error handler for unexpected errors
app.use((err, req, res, next) => {
  console.error(`Server error: ${err.message}`);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Start the server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
