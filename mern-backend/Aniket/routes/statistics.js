// routes/statistics.js
const express = require('express');
const router = express.Router();

// Example route for statistics
router.get('/statistics', async (req, res) => {
    try {
        // Your logic here
        res.json({ message: "Statistics data" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;



router.get('/statistics', async (req, res) => {
    const { month } = req.query;
    const query = { dateOfSale: { $regex: new RegExp(`-${month.padStart(2, '0')}-`, 'i') } };
  
    try {
      const totalSales = await ProductTransaction.aggregate([
        { $match: query },
        { $group: { _id: null, totalAmount: { $sum: "$price" } } }
      ]);
  
      const soldCount = await ProductTransaction.countDocuments({ ...query, isSold: true });
      const unsoldCount = await ProductTransaction.countDocuments({ ...query, isSold: false });
  
      res.status(200).json({
        totalSales: totalSales[0]?.totalAmount || 0,
        soldItems: soldCount,
        unsoldItems: unsoldCount
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching statistics', error });
    }
  });
  