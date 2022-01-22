const {
  Model,
  DataTypes
} = require('sequelize');
const sequelize = require('../config/connection');

class ProductTag extends Model {}
//This is the junction table
ProductTag.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'product',
      key: 'id',
    }
  },
  tag_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    primaryKey: true,
    references: {
      model: 'tag',
      key: 'id',
    }
  },
}, {
  sequelize,
  timestamps: false,
  freezeTableName: true,
  underscored: true,
  modelName: 'product_tag',
});

module.exports = ProductTag;