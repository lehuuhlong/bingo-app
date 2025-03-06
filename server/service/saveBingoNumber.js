const BingoNumber = require('../models/BingoNumber');

module.exports = async function (number) {
  const existingNumber = await BingoNumber.findOne({ number });
  if (existingNumber) {
    existingNumber.count += 1;
    await existingNumber.save();
  } else {
    const newNumber = new BingoNumber({ number });
    await newNumber.save();
  }
};
