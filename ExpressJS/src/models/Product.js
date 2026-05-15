const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0
    },
    originalPrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true
    },
    images: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    category: {
        type: DataTypes.STRING(150),
        allowNull: true
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    sold: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    similarIds: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    }
}, {
    tableName: 'products',
    timestamps: true
});

module.exports = Product;
