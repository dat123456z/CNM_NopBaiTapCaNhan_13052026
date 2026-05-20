const wishlistService = require('../services/wishlistService');

const getWishlist = async (req, res) => {
    try {
        const items = await wishlistService.getWishlist(req.user.id);
        return res.json(items);
    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message });
    }
};

const toggleWishlist = async (req, res) => {
    try {
        const result = await wishlistService.toggleWishlist(req.user.id, req.params.productId);
        return res.json(result);
    } catch (err) {
        return res.status(err.status || 500).json({ message: err.message });
    }
};

module.exports = { getWishlist, toggleWishlist };