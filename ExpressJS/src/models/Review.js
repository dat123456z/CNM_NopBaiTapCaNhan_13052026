const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Product review (requires purchased orderItemId)
const ProductReview = sequelize.define('ProductReview', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    orderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    rating: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, validate: { min: 1, max: 5 } },
    comment: { type: DataTypes.TEXT, allowNull: true },
    images: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
    vendorReply: { type: DataTypes.TEXT, allowNull: true },
    isHidden: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, { tableName: 'product_reviews', timestamps: true });

// Shop review (after first delivery from that shop)
const ShopReview = sequelize.define('ShopReview', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    shopId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    orderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    rating: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, validate: { min: 1, max: 5 } },
    comment: { type: DataTypes.TEXT, allowNull: true },
    isHidden: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, { tableName: 'shop_reviews', timestamps: true });

// Order review (rate delivery experience)
const OrderReview = sequelize.define('OrderReview', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    orderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, unique: true },
    rating: { type: DataTypes.TINYINT.UNSIGNED, allowNull: false, validate: { min: 1, max: 5 } },
    comment: { type: DataTypes.TEXT, allowNull: true }
}, { tableName: 'order_reviews', timestamps: true });

module.exports = { ProductReview, ShopReview, OrderReview };