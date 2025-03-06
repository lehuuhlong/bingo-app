const mongoose = require('mongoose');
const dateFormat = require('../service/dateFormatPlugin');

const BingoNumberSchema = new mongoose.Schema(
  {
    number: { type: Number, required: true },
    count: { type: Number, default: 1 },
  },
  { timestamps: true }
);

BingoNumberSchema.plugin(dateFormat);

module.exports = mongoose.model('BingoNumber', BingoNumberSchema);
