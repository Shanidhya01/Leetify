require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const problemsRouter = require('./routes/problems');
const submissionsRouter = require('./routes/submissions');
const userRouter = require('./routes/user');
const leaderboardRouter = require('./routes/leaderboard');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/leetclone';
mongoose.connect(MONGO).then(()=> console.log('MongoDB connected')).catch(err => console.error(err));

app.use('/api/problems', problemsRouter);
app.use('/api/submissions', submissionsRouter);
app.use('/api/user', userRouter);
app.use('/api/leaderboard', leaderboardRouter);

app.get('/', (req,res) => res.send('LeetClone Backend OK'));
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on', PORT));
