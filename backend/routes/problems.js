const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');
const firebaseAuth = require('../middleware/firebaseAuth');

router.get('/', problemController.list);
router.get('/search', problemController.search);
router.get('/:slug', problemController.getBySlug);
router.post('/', problemController.create); // protect in prod

// Favorites (requires auth)
router.post('/:slug/favorite', firebaseAuth, problemController.toggleFavorite);
router.get('/favorites/list', firebaseAuth, problemController.getFavorites);

module.exports = router;
