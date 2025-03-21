const express = require('express');
const { authenticate, isAdmin } = require('../middlewares/auth');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const router = express.Router();

router.get('/id/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/all', authenticate, isAdmin, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const users = await User.find()
      .sort({ point: -1, attend: -1, bingoCount: -1, pointBingo: -1, _id: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await User.countDocuments();

    res.status(200).json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/ranking', async (req, res) => {
  try {
    const users = await User.find({ bingoCount: { $gt: 0 } }).sort({ bingoCount: -1, pointBingo: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/refund-point', authenticate, isAdmin, async (req, res) => {
  const { users } = req.body;

  if (!users || users.length === 0) {
    return res.status(400).json({ error: 'Invalid user list!' });
  }

  try {
    const result = await User.updateMany({ username: { $in: users } }, { $inc: { point: 2 } });

    const transactions = users.map((username) => ({
      username,
      point: 2,
      type: 'Refund Point',
    }));

    await Transaction.insertMany(transactions);
    res.json({ message: 'Add 2 points successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/bingo-point', authenticate, isAdmin, async (req, res) => {
  const { users, point } = req.body;

  if (!users || users.length === 0) {
    return res.status(400).json({ error: 'Invalid user list!' });
  }

  try {
    const result = await User.updateMany({ username: { $in: users } }, { $inc: { bingoCount: 1, pointBingo: point } });

    const transactions = users.map((username) => ({
      username,
      point: point,
      type: 'Bingo Reward',
    }));

    await Transaction.insertMany(transactions);
    res.json({ message: 'Add Bingo points successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/close-bingo', authenticate, isAdmin, async (req, res) => {
  const { users } = req.body;

  if (!users || users.length === 0) {
    return res.status(400).json({ error: 'Invalid user list!' });
  }

  try {
    const result = await User.updateMany({ username: { $in: users } }, { $inc: { closeBingo: 1 } });

    res.json({ message: 'Update Close Bingo successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/minus-point', authenticate, isAdmin, async (req, res) => {
  const { users } = req.body;

  if (!users || users.length === 0) {
    return res.status(400).json({ error: 'Invalid user list!' });
  }

  try {
    const result = await User.updateMany({ username: { $in: users } }, { $inc: { point: -20 } });

    const transactions = users.map((username) => ({
      username,
      point: -20,
      type: 'Ticket Bingo',
    }));

    await Transaction.insertMany(transactions);
    res.json({ message: 'Ticket bingo points successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/take-attendance', authenticate, isAdmin, async (req, res) => {
  const { users } = req.body;

  if (!users || users.length === 0) {
    return res.status(400).json({ error: 'Invalid user list!' });
  }

  try {
    const result = await User.updateMany({ username: { $in: users } }, { $inc: { attend: 1 } });

    res.json({ message: 'Take attendance users successfully', result });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/add-point', authenticate, isAdmin, async (req, res) => {
  const { username, point, type, note } = req.body;

  if (!username || point === undefined) {
    return res.status(400).json({ message: 'Username and Points are requird!' });
  }

  try {
    let existingUser = await User.findOne({ username });

    if (!existingUser) return res.status(400).json({ message: 'Invalid Username!' });

    switch (type) {
      case 'Bingo Reward':
        existingUser.bingoCount += 1;
        existingUser.pointBingo += point;
        break;
      case 'Add Point':
      case 'Refund Point':
      case 'Ticket Bingo':
        existingUser.point += point;
        break;
      case 'Gift Point':
        existingUser.point += point;
        await User.updateOne({ username: 'admin' }, { $inc: { point: -point } });
        const transaction = new Transaction({
          username: 'admin',
          point: -point,
          type,
          note: 'Gift to ' + username,
        });
        await transaction.save();
        break;
      default:
        return res.status(400).json({ message: 'Invalid Type!' });
    }

    await existingUser.save();

    const transaction = new Transaction({
      username,
      point,
      type,
      note,
    });

    await transaction.save();

    res.json(existingUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/total-point-user', authenticate, isAdmin, async (req, res) => {
  try {
    const totalPoint = await User.aggregate([
      {
        $group: {
          _id: null,
          totalPoints: { $sum: '$point' },
        },
      },
    ]);

    res.status(200).json({ totalPoint });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
