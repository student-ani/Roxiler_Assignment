// models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    description: String,
    price: Number,
    category: String,
    dateOfSale: Date,
    sold: Boolean,
    // Add other fields based on the structure of the data
});

module.exports = mongoose.model('Product', productSchema);
