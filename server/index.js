import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './src/models/index.js';
import clientRoutes from './src/routes/clientRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import templateRoutes from './src/routes/templateRoutes.js';
import invoiceRoutes from './src/routes/invoiceRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import { authenticate } from './src/middleware/authMiddleware.js';
import { setupCronJobs } from './src/cron/recurringInvoices.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/clients', authenticate, clientRoutes);
app.use('/api/products', authenticate, productRoutes);
app.use('/api/templates', authenticate, templateRoutes);
app.use('/api/invoices', authenticate, invoiceRoutes);

// Basic test route
app.get('/', (req, res) => {
  res.send('Invoice Generator API is running');
});

// Sync database and start server
const startServer = async () => {
  try {
    // Authenticate checks if the credentials are correct
    await sequelize.authenticate();
    console.log('✅ Connection to local MySQL has been established successfully.');

    // Sync creates the tables if they do not exist
    await sequelize.sync();
    console.log('✅ Database synchronized successfully.');

    // Initialize Cron Jobs
    setupCronJobs();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

startServer();
