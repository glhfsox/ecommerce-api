const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Cart extends Model {}

Cart.init({
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active',
  },
}, {
  sequelize,
  modelName: 'Cart',
});

module.exports = Cart;