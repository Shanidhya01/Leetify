const mongoose = require('mongoose');
const SubmissionSchema = new mongoose.Schema({
  uid: String,
  email: String,
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
  language: String,
  sourceCode: String,
  status: { type: String, default: 'Pending' },
  runtime: Number,
  memory: Number,
  judgeResponse: mongoose.Schema.Types.Mixed
}, { timestamps: true });
module.exports = mongoose.model('Submission', SubmissionSchema);
