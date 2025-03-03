const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  username: { type: String, required: true },
  point: { type: Number, required: true },
  type: { type: String, required: true },
  date: { type: String, require: true },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
