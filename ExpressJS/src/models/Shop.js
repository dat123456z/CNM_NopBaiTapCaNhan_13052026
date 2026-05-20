const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Shop = sequelize.define('Shop', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    slug: { type: DataTypes.STRING(200), allowNull: true, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    logo: { type: DataTypes.STRING, allowNull: true },
    coverImage: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    email: { type: DataTypes.STRING(150), allowNull: true },
    address: { type: DataTypes.STRING(255), allowNull: true },
    balance: { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    rating: { type: DataTypes.DECIMAL(3, 2), allowNull: false, defaultValue: 0 },
    reviewCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    status: {
        type: DataTypes.ENUM('pending', 'active', 'suspended', 'closed'),
        allowNull: false,
        defaultValue: 'pending'
    },
    isVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, { tableName: 'shops', timestamps: true });

module.exports = Shop;