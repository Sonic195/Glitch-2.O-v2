const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: String,
  serverId: String,
  knuts: Number,
  ytTokens: Number,
});

const User = mongoose.model('User', userSchema);

mongoose.connect()

