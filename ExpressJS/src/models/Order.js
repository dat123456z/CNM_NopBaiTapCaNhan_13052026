const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    shopId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'shipping', 'delivered', 'cancelled', 'refunded'),
        allowNull: false,
        defaultValue: 'pending'
    },
    subtotal: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    discount: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    shippingFee: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
    total: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    couponCode: { type: DataTypes.STRING(50), allowNull: true },
    paymentMethod: { type: DataTypes.STRING(50), allowNull: true },
    paymentStatus: {
        type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
        allowNull: false,
        defaultValue: 'unpaid'
    },
    shippingAddress: { type: DataTypes.JSON, allowNull: true },
    note: { type: DataTypes.TEXT, allowNull: true },
    cancelledAt: { type: DataTypes.DATE, allowNull: true },
    cancelReason: { type: DataTypes.STRING, allowNull: true },
    deliveredAt: { type: DataTypes.DATE, allowNull: true }
}, { tableName: 'orders', timestamps: true });

const OrderItem = sequelize.define('OrderItem', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    orderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    color: { type: DataTypes.STRING(50), allowNull: true },
    // snapshot at purchase time
    productTitle: { type: DataTypes.STRING(255), allowNull: false },
    productImage: { type: DataTypes.STRING, allowNull: true }
}, { tableName: 'order_items', timestamps: false });

module.exports = { Order, OrderItem };