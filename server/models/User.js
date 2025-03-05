const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  point: { type: Number, default: 0 },
  pointBingo: { type: Number, default: 0 },
  bingoCount: { type: Number, default: 0 },
  attend: { type: Number, default: 0 },
  closeBingo: { type: Number, default: 0 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
});

module.exports = mongoose.model('User', UserSchema);
