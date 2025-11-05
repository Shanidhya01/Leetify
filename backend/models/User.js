const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: String,
  solved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }]
}, { timestamps: true });
module.exports = mongoose.model('User', UserSchema);
