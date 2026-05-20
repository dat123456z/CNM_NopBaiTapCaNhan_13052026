const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Wishlist = sequelize.define('Wishlist', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    productId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false }
}, {
    tableName: 'wishlists',
    timestamps: true,
    indexes: [{ unique: true, fields: ['userId', 'productId'] }]
});

module.exports = Wishlist;