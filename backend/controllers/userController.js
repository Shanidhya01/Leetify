const User = require('../models/User');

exports.getStats = async (req, res) => {
  const user = await User.findOne({ uid: req.user.uid }).populate('solved');
  if (!user) return res.status(404).json({ error: 'User not found' });

  const easy = user.solved.filter(p => p.difficulty === 'Easy').length;
  const medium = user.solved.filter(p => p.difficulty === 'Medium').length;
  const hard = user.solved.filter(p => p.difficulty === 'Hard').length;

  res.json({
    name: user.name,
    totalSolved: user.solved.length,
    easy, medium, hard,
  });
};
