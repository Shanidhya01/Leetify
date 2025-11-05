const Problem = require('../models/Problem');

exports.list = async (req, res, next) => {
  const problems = await Problem.find().select('title slug difficulty tags').lean();
  res.json(problems);
};

exports.getBySlug = async (req, res, next) => {
  const slug = req.params.slug;
  const p = await Problem.findOne({ slug }).lean();
  if (!p) return res.status(404).json({ error: 'Problem not found' });
  // hide hidden testcase outputs
  p.testcases = (p.testcases || []).map(tc => ({ input: tc.input, output: tc.hidden ? undefined : tc.output, hidden: tc.hidden }));
  res.json(p);
};

exports.create = async (req, res, next) => {
  // In prod protect this route via admin check
  const body = req.body;
  const problem = await Problem.create(body);
  res.status(201).json(problem);
};
