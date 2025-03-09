const express = require('express');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.get('/all', async (req, res) => {
  const { page = 1, limit = 10, username, type } = req.query;
  try {
    const filter = {};
    if (username) {
      filter.username = { $regex: username, $options: 'i' };
    }

    if (type) {
      filter.type = { $regex: type, $options: 'i' };
    }

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const count = await Transaction.countDocuments(filter);

    res.json({
      transactions,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/id', async (req, res) => {
  const { page = 1, limit = 10, username } = req.query;
  try {
    const filter = {};
    if (username) {
      filter.username = username;
    }

    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Transaction.countDocuments(filter);
    res.json({
      transactions,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
