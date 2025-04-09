const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class CartItem extends Model {}

CartItem.init({
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price_at_checkout: {
    type: DataTypes.DECIMAL(10, 2),
  },
}, {
  sequelize,
  modelName: 'CartItem',
});

module.exports = CartItem;