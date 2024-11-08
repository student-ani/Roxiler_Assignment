// routes/barchart.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Assuming Product model is set up correctly

// Define the /barchart endpoint
router.get('/barchart', async (req, res) => {
    try {
        const { month } = req.query;
        
        // Filter transactions based on month regardless of the year
        const transactions = await Product.find({
            dateOfSale: { $regex: new RegExp(`-${month}-`, 'i') }
        });

        // Define price ranges
        const priceRanges = [
            { range: '0-100', min: 0, max: 100, count: 0 },
            { range: '101-200', min: 101, max: 200, count: 0 },
            { range: '201-300', min: 201, max: 300, count: 0 },
            { range: '301-400', min: 301, max: 400, count: 0 },
            { range: '401-500', min: 401, max: 500, count: 0 },
            { range: '501-600', min: 501, max: 600, count: 0 },
            { range: '601-700', min: 601, max: 700, count: 0 },
            { range: '701-800', min: 701, max: 800, count: 0 },
            { range: '801-900', min: 801, max: 900, count: 0 },
            { range: '901-above', min: 901, max: Infinity, count: 0 },
        ];

        // Count items in each price range
        transactions.forEach(transaction => {
            const price = transaction.price;
            for (let range of priceRanges) {
                if (price >= range.min && price <= range.max) {
                    range.count++;
                    break;
                }
            }
        });

        // Return the result
        res.status(200).json({ data: priceRanges });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
