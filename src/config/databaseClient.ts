import { Sequelize } from 'sequelize';
import { dbConfig } from './database';

const sequelize = new Sequelize(
  dbConfig.name, 
  dbConfig.username, 
  dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: 'postgres',
    dialectOptions: dbConfig.ssl ? { ssl: { rejectUnauthorized: false } } : {},
    logging: false,
});

export const connectDatabase = async () => {
  try {
    await sequelize.authenticate();
    await import('../models/associations');
    await sequelize.sync({ force: false });
    console.log('✅ Connected to database');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
};

export default sequelize;