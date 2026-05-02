import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Invoice from './Invoice.js';
import User from './User.js';

const InvoiceAuditLog = sequelize.define('InvoiceAuditLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  oldStatus: {
    type: DataTypes.STRING,
    allowNull: true, // Null means it's the initial creation
  },
  newStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'invoice_audit_logs',
  timestamps: true,
  updatedAt: false, // We only care about when it was created
});

InvoiceAuditLog.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice', onDelete: 'CASCADE' });
Invoice.hasMany(InvoiceAuditLog, { foreignKey: 'invoiceId', as: 'auditLogs' });

InvoiceAuditLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(InvoiceAuditLog, { foreignKey: 'userId', as: 'invoiceLogs' });

export default InvoiceAuditLog;
