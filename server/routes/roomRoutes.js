const express = require('express');
const Room = require('../models/Room');
const router = express.Router();

router.get('/create', async (req, res) => {
  const { name, price } = req.body;
  const room = new Room({ name, price });
  await room.save();

  res.json({ message: 'Room created successfully', room });
});

router.get('/join', async (req, res) => {
  const { userId, roomId } = req.body;
  const room = await Room.findById(roomId);

  if (!room) return res.status(404).json({ message: 'Room not found' });

  if (!room.players.includes(userId)) {
    room.players.push(userId);
    await room.save();
  }

  res.json({ message: 'Joined room successfully', room });
});

module.exports = router;
