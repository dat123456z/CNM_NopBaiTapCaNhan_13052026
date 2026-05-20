const express = require('express');

const router = express.Router();

const { authMiddleware } = require('../middleware/auth');

const {
    registerShop,
    getMyShop,
    updateShop,
    getShopById,
    listShops,
    setShopStatus
} = require('../controllers/shopController');

router.post('/', authMiddleware, registerShop);

router.get('/', listShops);

router.get('/me', authMiddleware, getMyShop);

router.put('/me', authMiddleware, updateShop);

router.get('/:id', getShopById);

router.patch('/:id/status', authMiddleware, setShopStatus);

module.exports = router;