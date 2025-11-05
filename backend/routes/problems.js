const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');

router.get('/', problemController.list);
router.get('/:slug', problemController.getBySlug);
router.post('/', problemController.create); // protect this in prod

module.exports = router;
