const express = require('express');

const router = express.Router();

const { authMiddleware } = require('../middleware/auth');

const {
    getWishlist,
    toggleWishlist
} = require('../controllers/wishlistController');

router.get('/', authMiddleware, getWishlist);

router.post('/:productId', authMiddleware, toggleWishlist);

module.exports = router;