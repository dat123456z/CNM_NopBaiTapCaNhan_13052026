const Product = require('../models/Product');
const { Op } = require('sequelize');

const normalizeProduct = (product) => {
    if (!product) return null;

    const plain = product.get ? product.get({ plain: true }) : product;

    return {
        id: plain.id,
        title: plain.title,
        desc: plain.description,
        price: Number(plain.price),
        originalPrice: plain.originalPrice !== null && plain.originalPrice !== undefined ? Number(plain.originalPrice) : null,
        images: Array.isArray(plain.images) ? plain.images : [],
        image: Array.isArray(plain.images) && plain.images.length > 0 ? plain.images[0] : null,
        category: plain.category,
        stock: plain.stock,
        sold: plain.sold,
        similar: Array.isArray(plain.similarIds) ? plain.similarIds.map((item) => String(item)) : []
    };
};

const getProducts = async (req, res) => {
    try {
        const { ids } = req.query;

        const where = {};
        if (ids) {
            const idList = ids.split(',').map((item) => item.trim()).filter(Boolean);
            where.id = { [Op.in]: idList };
        }

        const products = await Product.findAll({ order: [['id', 'DESC']], where });
        return res.json(products.map(normalizeProduct));
    } catch (error) {
        return res.status(500).json({ message: 'Failed to load products', error: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        return res.json(normalizeProduct(product));
    } catch (error) {
        return res.status(500).json({ message: 'Failed to load product', error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    normalizeProduct
};