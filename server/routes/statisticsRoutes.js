const express = require('express');
const BingoNumber = require('../models/BingoNumber');

const router = express.Router();

router.get('/number-count', async (req, res) => {
  const { page = 1, limit = 10, number } = req.query;
  try {
    const filter = {};
    if (number) {
      filter.number = number;
    }

    const statistics = await BingoNumber.find(filter)
      .sort({ count: -1, number: 1, _id: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const totalCount = await BingoNumber.countDocuments(filter);

    res.json({
      statistics,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
