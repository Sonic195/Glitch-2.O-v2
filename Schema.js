const { Schema, model } = require('mongoose');

let test = new Schema({
  name: String
})

module.exports = model('testSchema82728', test)