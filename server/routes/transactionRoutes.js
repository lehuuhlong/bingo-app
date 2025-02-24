const express = require('express');
const Transaction = require('../models/Transaction');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('userId', 'name email');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching transactions' });
  }
});

module.exports = router;
