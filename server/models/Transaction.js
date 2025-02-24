const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  username: { type: String, required: true },
  points: { type: Number, required: true },
  bingoCount: { type: Number, default: 1 },
  date: { type: String, require: true },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
