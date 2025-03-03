const express = require('express');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.get('/id/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const users = await User.find().sort({ bingoCount: -1, point: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/ranking', async (req, res) => {
  try {
    const users = await User.find({ bingoCount: { $gt: 0 } }).sort({ bingoCount: -1, pointBingo: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/refund-point', async (req, res) => {
  const { users } = req.body;

  if (!users || users.length === 0) {
    return res.status(400).json({ error: 'Invalid user list!' });
  }

  try {
    const result = await User.updateMany({ username: { $in: users } }, { $inc: { point: 2, attend: 1 } });

    const transactions = users.map((username) => ({
      username,
      point: 2,
      type: 'Refund point',
      date: new Date().toISOString(),
    }));

    await Transaction.insertMany(transactions);
    res.json({ message: 'Add 2 points successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/add-point', async (req, res) => {
  const { username, point } = req.body;

  if (!username || point === undefined) {
    return res.status(400).json({ message: 'Username and Points are requird!' });
  }

  try {
    let existingUser = await User.findOne({ username });

    if (existingUser) {
      existingUser.point += point;
      await existingUser.save();
      res.json(existingUser);
    }

    const transaction = new Transaction({
      username,
      point,
      type: 'Add point',
      date: new Date().toISOString(),
    });

    await transaction.save();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/add-point-bingo', async (req, res) => {
  const { username, point } = req.body;

  if (!username || point === undefined) {
    return res.status(400).json({ message: 'Username and Points are requird!' });
  }

  try {
    let existingUser = await User.findOne({ username });

    if (existingUser) {
      existingUser.pointBingo += point;
      existingUser.bingoCount += 1;
      await existingUser.save();
      res.json(existingUser);
    }

    const transaction = new Transaction({
      username,
      point,
      type: 'Bingo Reward',
      date: new Date().toISOString(),
    });

    await transaction.save();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
