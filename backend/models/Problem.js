const mongoose = require('mongoose');
const TestcaseSchema = new mongoose.Schema({
  input: String,
  output: String,
  hidden: { type: Boolean, default: true }
});
const ProblemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  difficulty: { type: String, enum: ['Easy','Medium','Hard'], default: 'Easy' },
  tags: [String],
  examples: [{ input: String, output: String, explanation: String }],
  testcases: [TestcaseSchema],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
module.exports = mongoose.model('Problem', ProblemSchema);
