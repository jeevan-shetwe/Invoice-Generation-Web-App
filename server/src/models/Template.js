import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Template = sequelize.define('Template', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  branding: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
  fields: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
}, {
  tableName: 'templates',
  timestamps: true,
});

// Relationships
Template.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Template, { foreignKey: 'userId', as: 'templates' });

export default Template;
