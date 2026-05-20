const express = require('express');

const router = express.Router();

const { authMiddleware } = require('../middleware/auth');

const {
    getShopRevenue,
    getWalletHistory,
    getPlatformRevenue
} = require('../controllers/revenueController');

router.get('/shop', authMiddleware, getShopRevenue);

router.get('/wallet-history', authMiddleware, getWalletHistory);

router.get('/platform', authMiddleware, getPlatformRevenue);

module.exports = router;