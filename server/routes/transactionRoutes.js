const express = require('express');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.get('/all', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const transactions = await Transaction.find()
      .sort({ date: -1, _id: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Transaction.countDocuments();

    res.json({
      transactions,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/id', async (req, res) => {
  const { page = 1, limit = 10, username } = req.query;
  try {
    const transactions = await Transaction.find({ username })
      .sort({ date: -1, _id: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = transactions.length;

    res.json({
      transactions,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
