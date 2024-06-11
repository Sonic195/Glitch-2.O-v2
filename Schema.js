const { Schema, model } = require('mongoose');

const auraSchema = new Schema({
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
  }
})

module.exports = model('Aura', auraSchema);