// routes/transactions.js
const express = require('express');
const ProductTransaction = require('../models/Product');
const router = express.Router();

router.get('/transactions', async (req, res) => {
  const { page = 1, perPage = 10, search = '', month } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
      { price: Number(search) }
    ];
  }

  if (month) {
    query.dateOfSale = { $regex: new RegExp(`-${month.padStart(2, '0')}-`, 'i') };
  }

  try {
    const total = await ProductTransaction.countDocuments(query);
    const transactions = await ProductTransaction.find(query)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    res.status(200).json({ transactions, total });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
});

module.exports = router;
