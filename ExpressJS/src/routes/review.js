const express = require('express');

const router = express.Router();

const { authMiddleware } = require('../middleware/auth');

const {
    createProductReview,
    createShopReview,
    createOrderReview,
    getProductReviews,
    vendorReplyReview,
    setReviewVisibility
} = require('../controllers/reviewController');

router.post('/product', authMiddleware, createProductReview);

router.post('/shop', authMiddleware, createShopReview);

router.post('/order', authMiddleware, createOrderReview);

router.get('/product/:productId', getProductReviews);

router.patch('/:id/reply', authMiddleware, vendorReplyReview);

router.patch(
    '/:type/:id/visibility',
    authMiddleware,
    setReviewVisibility
);

module.exports = router;