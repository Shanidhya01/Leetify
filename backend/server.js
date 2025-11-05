require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const problemsRouter = require('./routes/problems');
const submissionsRouter = require('./routes/submissions');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());

// Mongo connect
const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/leetclone';
mongoose.connect(MONGO).then(()=> console.log('MongoDB connected')).catch(err => console.error(err));

app.use('/api/problems', problemsRouter);
app.use('/api/submissions', submissionsRouter);

// health
app.get('/', (req,res) => res.send('LeetClone Backend OK'));

// error handler last
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Server running on', PORT));
