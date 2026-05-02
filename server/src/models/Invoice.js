import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';
import Client from './Client.js';

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Finalised', 'Paid', 'Cancelled'),
    defaultValue: 'Draft',
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'USD',
  },
  issueDate: {
    type: DataTypes.DATEONLY,
  },
  dueDate: {
    type: DataTypes.DATEONLY,
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  taxTotal: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  grandTotal: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00,
  },
  templateSnapshot: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  clientSnapshot: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  isRecurring: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  recurringInterval: {
    type: DataTypes.ENUM('Daily', 'Weekly', 'Monthly', 'Yearly', 'Custom'),
    allowNull: true,
  },
  recurringIntervalValue: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  nextRecurrenceDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  recurringEndType: {
    type: DataTypes.ENUM('Never', 'Date', 'Count'),
    defaultValue: 'Never',
  },
  recurringEndDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  recurringEndCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  signatureUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  termsAndConditions: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  additionalInfo: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  contactEmail: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contactPhone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  attachments: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: [],
  },
}, {
  tableName: 'invoices',
  timestamps: true,
});

// Relationships
Invoice.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Invoice, { foreignKey: 'userId', as: 'invoices' });

Invoice.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
Client.hasMany(Invoice, { foreignKey: 'clientId', as: 'invoices' });

export default Invoice;
