const express = require('express');
const BingoNumber = require('../models/BingoNumber');

const router = express.Router();

router.get('/number-count', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const statistics = await BingoNumber.find()
      .sort({ count: -1, number: 1, _id: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const count = await BingoNumber.countDocuments();

    res.json({
      statistics,
      totalPages: Math.ceil(count / limit),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/update-number', async (req, res) => {
  const { numbers } = req.body;

  if (!numbers || numbers.length === 0) {
    return res.status(400).json({ error: 'Invalid user list!' });
  }

  try {
    const result = await BingoNumber.updateMany({ number: { $in: numbers } }, { $inc: { count: 1 } });
    res.json({ message: 'Add Number count successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
