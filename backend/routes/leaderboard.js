const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/', async (req, res) => {
  const users = await User.find().select('name solved').lean();
  const ranks = users.map(u => ({ name: u.name || u.email, solved: (u.solved || []).length }));
  ranks.sort((a,b) => b.solved - a.solved);
  res.json(ranks);
});

module.exports = router;
