// routes/combined.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const axios = require('axios');

// Define the /combined endpoint
router.get('/combined', async (req, res) => {
    try {
        const { month } = req.query;

        // Fetch statistics data
        const totalSales = await Product.aggregate([
            { $match: { dateOfSale: { $regex: new RegExp(`-${month}-`, 'i') } } },
            { $group: { _id: null, totalAmount: { $sum: "$price" }, totalSoldItems: { $sum: 1 } } }
        ]);

        const soldCount = totalSales[0]?.totalSoldItems || 0;
        const totalAmount = totalSales[0]?.totalAmount || 0;

        // Fetch bar chart data
        const barChartData = await Product.aggregate([
            { $match: { dateOfSale: { $regex: new RegExp(`-${month}-`, 'i') } } },
            { $bucket: { groupBy: "$price", boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity], default: "901-above" } },
            { $group: { _id: "$price", count: { $sum: 1 } } }
        ]);

        // Fetch pie chart data
        const pieChartData = await Product.aggregate([
            { $match: { dateOfSale: { $regex: new RegExp(`-${month}-`, 'i') } } },
            { $group: { _id: "$category", count: { $sum: 1 } } }
        ]);

        // Combine responses
        const response = {
            statistics: { totalAmount, soldCount },
            barChart: barChartData,
            pieChart: pieChartData
        };

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
