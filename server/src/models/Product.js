import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '',
  },
}, {
  tableName: 'products',
  timestamps: true,
});

// Relationships
Product.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Product, { foreignKey: 'userId', as: 'products' });

export default Product;
