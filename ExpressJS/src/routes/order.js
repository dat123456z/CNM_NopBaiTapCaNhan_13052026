const express = require('express');

const router = express.Router();

const { authMiddleware } = require('../middleware/auth');

const {
    createOrder,
    getMyOrders,
    getOrderDetail,
    cancelOrder,
    updateOrderStatus,
    getShopOrders
} = require('../controllers/orderController');

router.post('/', authMiddleware, createOrder);

router.get('/me', authMiddleware, getMyOrders);

router.get('/shop', authMiddleware, getShopOrders);

router.get('/:id', authMiddleware, getOrderDetail);

router.patch('/:id/cancel', authMiddleware, cancelOrder);

router.patch('/:id/status', authMiddleware, updateOrderStatus);

module.exports = router;