import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.TEXT,
  },
  phone: {
    type: DataTypes.STRING,
  },
}, {
  tableName: 'clients',
  timestamps: true,
});

// Relationships
Client.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Client, { foreignKey: 'userId', as: 'clients' });

export default Client;
