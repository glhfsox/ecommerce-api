const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Order extends Model {}

Order.init({
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
}, {
  sequelize,
  modelName: 'Order',
});

module.exports = Order;