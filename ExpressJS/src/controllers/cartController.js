const cartService = require('../services/cartService');

const getCart = async (req, res) => {
    try {
        const cart = await cartService.getCart(req.user.id);
        return res.json(cart);
    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message });
    }
};

const addToCart = async (req, res) => {
    try {
        const item = await cartService.addToCart(req.user.id, req.body);
        return res.status(201).json(item);
    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        if (quantity === undefined)
            return res.status(400).json({ message: 'Vui lòng cung cấp số lượng.' });
        const item = await cartService.updateCartItem(req.user.id, req.params.id, Number(quantity));
        return res.json(item || { message: 'Đã xoá sản phẩm khỏi giỏ.' });
    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message });
    }
};

const removeFromCart = async (req, res) => {
    try {
        await cartService.removeFromCart(req.user.id, req.params.id);
        return res.json({ message: 'Đã xoá sản phẩm khỏi giỏ.' });
    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message });
    }
};

const clearCart = async (req, res) => {
    try {
        await cartService.clearCart(req.user.id);
        return res.json({ message: 'Đã xoá toàn bộ giỏ hàng.' });
    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message });
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };