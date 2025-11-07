const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const User = require('../models/User');
const axios = require('axios');
const mapLangToJudge0Id = require('../utils/mapLang');

const JUDGE0_URL = process.env.JUDGE0_URL;
const JUDGE0_KEY = process.env.JUDGE0_KEY;

function judgeHeaders() {
  if (JUDGE0_KEY) {
    return {
      'X-RapidAPI-Key': JUDGE0_KEY,
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      'Content-Type': 'application/json'
    };
  }
  return { 'Content-Type': 'application/json' };
}

/**
 * SUBMIT SOLUTION (saved to DB)
 * Runs all problem testcases, checks correctness, and stores the result.
 */
exports.create = async (req, res, next) => {
  try {
    const { problemSlug, language, sourceCode } = req.body;
    const { uid, email } = req.user;

    if (!problemSlug || !language || !sourceCode)
      return res.status(400).json({ error: 'Missing fields' });

    const problem = await Problem.findOne({ slug: problemSlug });
    if (!problem)
      return res.status(404).json({ error: 'Problem not found' });

    const submission = await Submission.create({
      uid,
      email,
      problem: problem._id,
      language,
      sourceCode,
      status: 'Pending'
    });

    const results = [];

    for (const tc of problem.testcases) {
      const payload = {
        language_id: mapLangToJudge0Id(language),
        source_code: Buffer.from(sourceCode).toString('base64'),
        stdin: Buffer.from(tc.input || "").toString('base64'),
        expected_output: Buffer.from(tc.output || "").toString('base64')
      };

      try {
        const resp = await axios.post(
          `${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`,
          payload,
          { headers: judgeHeaders() }
        );
        results.push(resp.data);
      } catch (err) {
        console.error('Judge0 error in test case:', err.response?.data || err.message);
        results.push({ error: err.message, detail: err.response?.data });
      }
    }

    const allAccepted = results.every(
      r => r.status && r.status.id === 3
    );

    submission.status = allAccepted ? 'Accepted' : 'Failed';
    submission.judgeResponse = results;
    await submission.save();

    // Update user's solved problems
    if (allAccepted) {
      let user = await User.findOne({ uid });
      if (!user) {
        user = await User.create({
          uid,
          email,
          name: req.user.name || email,
          solved: []
        });
      }
      if (!user.solved.find(id => id.toString() === problem._id.toString())) {
        user.solved.push(problem._id);
        await user.save();
      }
    }

    return res.json({
      submissionId: submission._id,
      status: submission.status,
      results
    });
  } catch (err) {
    console.error('Submission error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * RUN CODE (no DB save)
 * Executes the given code against a single input.
 */
exports.runCode = async (req, res, next) => {
  try {
    const { language, sourceCode, input } = req.body;
    if (!language || !sourceCode)
      return res.status(400).json({ error: 'Missing fields' });

    const payload = {
      language_id: mapLangToJudge0Id(language),
      source_code: Buffer.from(sourceCode).toString('base64'),
      stdin: Buffer.from(input || "").toString('base64')
    };

    console.log('DEBUG runCode payload:', payload.language_id, language);

    const resp = await axios.post(
      `${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`,
      payload,
      { headers: judgeHeaders() }
    );

    return res.json(resp.data);
  } catch (err) {
    console.error('Run code error:', err.response?.data || err.message);
    return res.status(500).json({
      error: err.message,
      detail: err.response?.data || 'Judge0 error'
    });
  }
};

/**
 * GET SUBMISSION BY ID
 */
exports.get = async (req, res, next) => {
  try {
    const id = req.params.id;
    const s = await Submission.findById(id).populate('problem').lean();
    if (!s) return res.status(404).json({ error: 'Submission not found' });
    if (s.uid !== req.user.uid)
      return res.status(403).json({ error: 'Forbidden' });
    res.json(s);
  } catch (err) {
    console.error('Get submission error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

/**
 * LIST SUBMISSIONS FOR USER
 */
exports.listForUser = async (req, res, next) => {
  try {
    const uid = req.user.uid;
    const subs = await Submission.find({ uid })
      .populate('problem', 'title slug')
      .sort({ createdAt: -1 })
      .lean();
    res.json(subs);
  } catch (err) {
    console.error('List submissions error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
