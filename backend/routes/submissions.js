const express = require('express');
const router = express.Router();
const firebaseAuth = require('../middleware/firebaseAuth');
const submissionController = require('../controllers/submissionController');

// all submission routes require auth
router.use(firebaseAuth);

router.post('/', submissionController.create);
router.get('/:id', submissionController.get);

module.exports = router;
