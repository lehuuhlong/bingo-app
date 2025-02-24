const express = require('express');
const Point = require('../models/Point');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await Point.find().sort({ bingoCount: -1, points: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', async (req, res) => {
  const { username, points, bingoCount = 1 } = req.body;

  if (!username || points === undefined) {
    return res.status(400).json({ message: 'Username và Points là requird!' });
  }

  try {
    let existingUser = await Point.findOne({ username });

    if (existingUser) {
      existingUser.points += points;
      existingUser.bingoCount += bingoCount;
      await existingUser.save();
      res.json(existingUser);
    } else {
      const newUser = new Point({ username, points, bingoCount });
      await newUser.save();
      res.status(201).json(newUser);
    }

    const transaction = new Transaction({
      username,
      points,
      bingoCount,
      date: new Date().toISOString().split('T')[0], // save YYYY-MM-DD
    });

    await transaction.save();
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server khi thêm user' });
  }
});

module.exports = router;
