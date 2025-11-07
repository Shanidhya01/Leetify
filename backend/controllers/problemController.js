const Problem = require('../models/Problem');

exports.list = async (req, res, next) => {
  const problems = await Problem.find().select('title slug difficulty tags').lean();
  res.json(problems);
};

exports.getBySlug = async (req, res, next) => {
  const slug = req.params.slug;
  const p = await Problem.findOne({ slug }).lean();
  if (!p) return res.status(404).json({ error: 'Problem not found' });
  p.testcases = (p.testcases || []).map(tc => ({ input: tc.input, output: tc.hidden ? undefined : tc.output, hidden: tc.hidden }));
  res.json(p);
};

exports.create = async (req, res, next) => {
  const body = req.body;
  const problem = await Problem.create(body);
  res.status(201).json(problem);
};

// search by title or tags (query param ?q=)
exports.search = async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return exports.list(req, res);
  const regex = new RegExp(q, 'i');
  const results = await Problem.find({ $or: [{ title: regex }, { tags: regex }] }).select('title slug difficulty tags').lean();
  res.json(results);
};

// toggle favorite for authenticated user
exports.toggleFavorite = async (req, res) => {
  const slug = req.params.slug;
  const uid = req.user.uid;
  const ProblemModel = require('../models/Problem');
  const User = require('../models/User');

  const problem = await ProblemModel.findOne({ slug });
  if (!problem) return res.status(404).json({ error: 'Problem not found' });

  const user = await User.findOne({ uid });
  if (!user) return res.status(404).json({ error: 'User not found' });

  const idx = problem.favorites.findIndex(id => id.toString() === user._id.toString());
  if (idx === -1) {
    problem.favorites.push(user._id);
    await problem.save();
    return res.json({ favorited: true });
  } else {
    problem.favorites.splice(idx, 1);
    await problem.save();
    return res.json({ favorited: false });
  }
};

exports.getFavorites = async (req, res) => {
  const uid = req.user.uid;
  const User = require('../models/User');
  const user = await User.findOne({ uid }).populate('solved');
  if (!user) return res.status(404).json({ error: 'User not found' });

  const problems = await Problem.find({ favorites: user._id }).select('title slug difficulty tags').lean();
  res.json(problems);
};
