import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Invoice from './Invoice.js';
import Product from './Product.js';

const InvoiceItem = sequelize.define('InvoiceItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 1.00,
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  taxRate: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0.00,
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'invoice_items',
  timestamps: true,
});

// Relationships
InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice', onDelete: 'CASCADE' });
Invoice.hasMany(InvoiceItem, { foreignKey: 'invoiceId', as: 'items', onDelete: 'CASCADE' });

InvoiceItem.belongsTo(Product, { foreignKey: 'productId', as: 'product', onDelete: 'SET NULL' });
Product.hasMany(InvoiceItem, { foreignKey: 'productId', as: 'invoiceItems', onDelete: 'SET NULL' });

export default InvoiceItem;
