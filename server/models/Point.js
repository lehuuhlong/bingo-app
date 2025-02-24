const mongoose = require('mongoose');

const PointSchema = new mongoose.Schema({
  username: { type: String, required: true },
  points: { type: Number, required: true },
  bingoCount: { type: Number, default: 1 },
});

module.exports = mongoose.model('Point', PointSchema);
