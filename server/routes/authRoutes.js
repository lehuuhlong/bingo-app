const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ username, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Incorrect username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect username or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, username: user.username, role: user.role, point: user.point, isPassword: true } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login-guess', async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      const newUser = new User({ username });
      await newUser.save();
      const user = await User.findOne({ username });
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      let isPassword = user.password ? true : false;
      res.json({ token, user: { id: user._id, username: user.username, role: user.role, point: user.point, isPassword } });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
      let isPassword = user.password ? true : false;
      res.json({ token, user: { id: user._id, username: user.username, role: user.role, point: user.point, isPassword } });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/create-password', async (req, res) => {
  const { password, username } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Incorrect username' });

    if (user?.password) return res.status(200).json({ message: 'Password already exist' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    await user.save();
    res.status(200).json({ message: 'Create passowrd successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/change-password', async (req, res) => {
  const { username, password, newpassword } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Incorrect username' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(200).json({ message: 'Incorrect old password' });

    const hashedPassword = await bcrypt.hash(newpassword, 10);
    user.password = hashedPassword;

    await user.save();
    res.status(200).json({ message: 'Change passowrd successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
