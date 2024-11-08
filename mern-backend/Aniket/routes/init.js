// routes/init.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const Product = require('../models/Product'); // Assuming you have a Product model

router.get('/init', async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = response.data;
        
        // Seed database with fetched data
        await Product.insertMany(data);

        res.status(200).json({ message: "Database initialized with seed data" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
