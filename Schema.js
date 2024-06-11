const { Schema, model } = require('mongoose');

const dataSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  aura: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 0,
  },
  lastClaimed: Date,
})

module.exports = model('Data', dataSchema);