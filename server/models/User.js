const mongoose = require('mongoose');
const dateFormat = require('../service/dateFormatPlugin');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, default: '' },
    point: { type: Number, default: 0 },
    pointBingo: { type: Number, default: 0 },
    bingoCount: { type: Number, default: 0 },
    attend: { type: Number, default: 0 },
    closeBingo: { type: Number, default: 0 },
    role: { type: String, enum: ['user', 'admin', 'moderator'], default: 'user' },
  },
  { timestamps: true }
);

UserSchema.plugin(dateFormat);

module.exports = mongoose.model('User', UserSchema);
