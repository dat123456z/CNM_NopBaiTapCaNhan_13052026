const { Op } = require('sequelize');
const Product = require('../models/Product');

const slugify = (text) =>
    text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/gi, 'd')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '')
        .replace(/-+/g, '-');

const normalizeProduct = (product) => {
    if (!product) return null;
    const p = product.get ? product.get({ plain: true }) : product;
    return {
        id: p.id,
        shopId: p.shopId,
        title: p.title,
        slug: p.slug,
        desc: p.description,
        price: Number(p.price),
        originalPrice: p.originalPrice != null ? Number(p.originalPrice) : null,
        images: Array.isArray(p.images) ? p.images : [],
        image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null,
        category: p.category,
        stock: p.stock,
        sold: p.sold,
        status: p.status,
        rating: Number(p.rating),
        reviewCount: p.reviewCount,
        similar: Array.isArray(p.similarIds) ? p.similarIds.map(String) : [],
        colors: Array.isArray(p.colors) ? p.colors : []
    };
};

const getProducts = async ({ ids, category, search, shopId, minPrice, maxPrice, sort = 'newest', page = 1, limit = 20 }) => {
    const where = { status: 'active' };

    if (ids) {
        const parsedIds = ids.split(',').map((v) => parseInt(v.trim(), 10)).filter((n) => !isNaN(n));
        if (parsedIds.length === 0) return { total: 0, page: Number(page), limit: Number(limit), products: [] };
        where.id = { [Op.in]: parsedIds };
    }
    if (category) where.category = category;
    if (shopId) where.shopId = shopId;
    if (search) where.title = { [Op.like]: `%${search}%` };
    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price[Op.gte] = Number(minPrice);
        if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }

    const orderMap = {
        newest:     [['createdAt', 'DESC']],
        oldest:     [['createdAt', 'ASC']],
        price_asc:  [['price', 'ASC']],
        price_desc: [['price', 'DESC']],
        popular:    [['sold', 'DESC']],
        rating:     [['rating', 'DESC']]
    };
    const order = orderMap[sort] || orderMap.newest;
    const offset = (page - 1) * limit;

    const { count, rows } = await Product.findAndCountAll({ where, order, limit: Number(limit), offset });
    return { total: count, page: Number(page), limit: Number(limit), products: rows.map(normalizeProduct) };
};

const getProductById = async (id) => {
    const product = await Product.findOne({ where: { id, status: 'active' } });
    if (!product) throw Object.assign(new Error('Sản phẩm không tồn tại.'), { status: 404 });
    return normalizeProduct(product);
};

const createProduct = async (shopId, data) => {
    const { title, description, price, originalPrice, images, category, stock, colors } = data;
    const slug = `${slugify(title)}-${Date.now()}`;
    const product = await Product.create({
        shopId, title, slug, description, price, originalPrice,
        images: images || [], category, stock: stock || 0,
        colors: colors || [], status: 'active'
    });
    return normalizeProduct(product);
};

const updateProduct = async (productId, shopId, data) => {
    const product = await Product.findOne({ where: { id: productId, shopId } });
    if (!product) throw Object.assign(new Error('Sản phẩm không tồn tại.'), { status: 404 });
    if (data.title && data.title !== product.title) {
        data.slug = `${slugify(data.title)}-${Date.now()}`;
    }
    await product.update(data);
    return normalizeProduct(product);
};

const deleteProduct = async (productId, shopId) => {
    const product = await Product.findOne({ where: { id: productId, shopId } });
    if (!product) throw Object.assign(new Error('Sản phẩm không tồn tại.'), { status: 404 });
    await product.update({ status: 'deleted' });
};

const setProductStatus = async (productId, status) => {
    const product = await Product.findByPk(productId);
    if (!product) throw Object.assign(new Error('Sản phẩm không tồn tại.'), { status: 404 });
    await product.update({ status });
    return normalizeProduct(product);
};

module.exports = { normalizeProduct, getProducts, getProductById, createProduct, updateProduct, deleteProduct, setProductStatus };