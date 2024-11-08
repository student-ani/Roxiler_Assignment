// routes/piechart.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Define the /piechart endpoint
router.get('/piechart', async (req, res) => {
    try {
        const { month } = req.query;
        
        // Fetch transactions based on month regardless of year
        const transactions = await Product.find({
            dateOfSale: { $regex: new RegExp(`-${month}-`, 'i') }
        });

        // Create a category count
        const categoryCounts = {};
        transactions.forEach(transaction => {
            const category = transaction.category;
            if (categoryCounts[category]) {
                categoryCounts[category]++;
            } else {
                categoryCounts[category] = 1;
            }
        });

        // Format response as array of { category, count }
        const result = Object.keys(categoryCounts).map(category => ({
            category,
            count: categoryCounts[category]
        }));

        res.status(200).json({ data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
