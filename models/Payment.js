const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Payment extends Model {}

Payment.init({
  stripe_payment_intent: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
}, {
  sequelize,
  modelName: 'Payment',
});

module.exports = Payment;