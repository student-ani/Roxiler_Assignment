require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection URI
const dbURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// Connect to MongoDB
mongoose.connect(dbURI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err);
    });

// Routes
const initRoutes = require('./routes/init');
const transactionsRoutes = require('./routes/transactions');
const statisticsRoutes = require('./routes/statistics');
const barchartRoutes = require('./routes/barchart');
const piechartRoutes = require('./routes/piechart');
const combinedRoutes = require('./routes/combined');

// Use different prefixes for different routes
app.use('/api/init', initRoutes);           // Initialize routes
app.use('/api/transactions', transactionsRoutes); // Transactions routes
app.use('/api/statistics', statisticsRoutes);  // Statistics routes
app.use('/api/barchart', barchartRoutes);    // Bar chart routes
app.use('/api/piechart', piechartRoutes);    // Pie chart routes
app.use('/api/combined', combinedRoutes);    // Combined routes

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
