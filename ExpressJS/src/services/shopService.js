const Shop = require('../models/Shop');
const User = require('../models/User');
const { sequelize } = require('../config/database');

const slugify = (name) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') + '-' + Date.now();

const registerShop = async (userId, { name, description, address, phone }) => {
    const existing = await Shop.findOne({ where: { userId } });
    if (existing) throw Object.assign(new Error('Bạn đã có shop.'), { status: 409 });

    const t = await sequelize.transaction();
    try {
        const shop = await Shop.create(
            { userId, name, slug: slugify(name), description, address, phone, status: 'pending' },
            { transaction: t }
        );
        await User.update({ role: 'vendor' }, { where: { id: userId }, transaction: t });
        await t.commit();
        return shop;
    } catch (err) {
        await t.rollback();
        throw err;
    }
};

const getMyShop = async (userId) => {
    const shop = await Shop.findOne({ where: { userId } });
    if (!shop) throw Object.assign(new Error('Bạn chưa có shop.'), { status: 404 });
    return shop;
};

const updateShop = async (userId, updates) => {
    const shop = await Shop.findOne({ where: { userId } });
    if (!shop) throw Object.assign(new Error('Shop không tồn tại.'), { status: 404 });
    await shop.update(updates);
    return shop;
};

const getShopById = async (id) => {
    const shop = await Shop.findByPk(id);
    if (!shop || shop.status !== 'active') throw Object.assign(new Error('Shop không tồn tại.'), { status: 404 });
    return shop;
};

const listShops = async ({ page = 1, limit = 20, status, search }) => {
    const { Op } = require('sequelize');
    const where = {};
    if (status) where.status = status;
    if (search) where.name = { [Op.like]: `%${search}%` };
    const offset = (page - 1) * limit;
    const { count, rows } = await Shop.findAndCountAll({ where, order: [['createdAt', 'DESC']], limit: Number(limit), offset });
    return { total: count, page: Number(page), limit: Number(limit), shops: rows };
};

const setShopStatus = async (shopId, status) => {
    const validStatuses = ['pending', 'active', 'suspended', 'closed'];
    if (!validStatuses.includes(status)) throw Object.assign(new Error('Trạng thái không hợp lệ.'), { status: 400 });
    const shop = await Shop.findByPk(shopId);
    if (!shop) throw Object.assign(new Error('Shop không tồn tại.'), { status: 404 });
    await shop.update({ status });
    return shop;
};

module.exports = { registerShop, getMyShop, updateShop, getShopById, listShops, setShopStatus };