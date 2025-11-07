const express = require('express');
const router = express.Router();
const firebaseAuth = require('../middleware/firebaseAuth');
const userController = require('../controllers/userController');

router.get('/stats', firebaseAuth, userController.getStats);

module.exports = router;
