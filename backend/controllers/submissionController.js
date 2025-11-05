const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');
const axios = require('axios');
const mapLangToJudge0Id = require('../utils/mapLang');

const JUDGE0_URL = process.env.JUDGE0_URL;
const JUDGE0_KEY = process.env.JUDGE0_KEY;

function judgeHeaders() {
  if (JUDGE0_KEY) {
    return { 'X-RapidAPI-Key': JUDGE0_KEY, 'Content-Type': 'application/json' };
  }
  return { 'Content-Type': 'application/json' };
}

exports.create = async (req, res, next) => {
  const { problemSlug, language, sourceCode } = req.body;
  const { uid, email } = req.user;
  if (!problemSlug || !language || !sourceCode) return res.status(400).json({ error: 'Missing fields' });

  const problem = await Problem.findOne({ slug: problemSlug });
  if (!problem) return res.status(404).json({ error: 'Problem not found' });

  const submission = await Submission.create({ uid, email, problem: problem._id, language, sourceCode, status: 'Pending' });

  // Run all testcases sequentially via Judge0 (wait=true). For production, consider batch/submission tokens + async worker
  const results = [];
  for (const tc of problem.testcases) {
    const payload = {
      language_id: mapLangToJudge0Id(language),
      source_code: sourceCode,
      stdin: tc.input,
      expected_output: tc.output
    };
    try {
      const resp = await axios.post(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, payload, { headers: judgeHeaders() });
      results.push(resp.data);
    } catch (err) {
      results.push({ error: err.message });
    }
  }

  const allAccepted = results.every(r => r.status && r.status.id === 3);
  submission.status = allAccepted ? 'Accepted' : 'Failed';
  submission.judgeResponse = results;
  await submission.save();

  // update user solved list if accepted
  if (allAccepted) {
    let user = await User.findOne({ uid });
    if (!user) {
      user = await User.create({ uid, email, name: req.user.name || email, solved: [] });
    }
    if (!user.solved.find(id => id.toString() === problem._id.toString())) {
      user.solved.push(problem._id);
      await user.save();
    }
  }

  res.json({ submissionId: submission._id, status: submission.status, results });
};

exports.get = async (req, res, next) => {
  const id = req.params.id;
  const s = await Submission.findById(id).populate('problem').lean();
  if (!s) return res.status(404).json({ error: 'Submission not found' });
  // ensure the requester is owner or admin check (for now allow if owner)
  if (s.uid !== req.user.uid) return res.status(403).json({ error: 'Forbidden' });
  res.json(s);
};
