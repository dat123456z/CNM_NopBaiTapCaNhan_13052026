const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WalletTransaction = sequelize.define('WalletTransaction', {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    shopId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    orderId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    type: {
        type: DataTypes.ENUM('credit', 'debit', 'withdrawal', 'refund'),
        allowNull: false
    },
    amount: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    balanceAfter: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
    note: { type: DataTypes.STRING, allowNull: true }
}, { tableName: 'wallet_transactions', timestamps: true });

module.exports = WalletTransaction;