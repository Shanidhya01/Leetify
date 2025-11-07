const express = require('express');
const router = express.Router();
const firebaseAuth = require('../middleware/firebaseAuth');
const submissionController = require('../controllers/submissionController');

// all submission routes require auth (except run if you want public run - we keep auth to avoid abuse)
router.use(firebaseAuth);

router.post('/', submissionController.create);
router.post('/run', submissionController.runCode);
router.get('/', submissionController.listForUser);
router.get('/:id', submissionController.get);

module.exports = router;
