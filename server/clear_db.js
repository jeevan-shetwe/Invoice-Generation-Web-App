import { sequelize } from './src/models/index.js';

const clearDatabase = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    
    console.log('⚠️  Dropping and recreating all tables (resetting all data)...');
    // Using force: true will drop all tables and recreate them from the models
    await sequelize.sync({ force: true });
    
    console.log('✅ Database cleared successfully! All data removed and schema reset.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();
