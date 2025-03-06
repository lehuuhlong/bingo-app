const mongoose = require('mongoose');
const dateFormat = require('../service/dateFormatPlugin');

const TransactionSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    point: { type: Number, required: true },
    type: { type: String, required: true },
    note: { type: String, default: '' },
  },
  { timestamps: true }
);

TransactionSchema.index({ createdAt: -1 });
TransactionSchema.plugin(dateFormat);

module.exports = mongoose.model('Transaction', TransactionSchema);
