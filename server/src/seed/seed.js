import bcrypt from 'bcryptjs';
import { sequelize, User, Client, Template, Product } from '../models/index.js';

const runSeed = async () => {
  try {
    console.log('Starting database seed...');
    
    // Warning: force: true will drop all existing tables
    await sequelize.sync({ force: true });
    console.log('✅ Database synced and cleared.');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const user = await User.create({
      email: 'admin@example.com',
      passwordHash,
      companyName: 'Acme Corp'
    });
    console.log('✅ User created: admin@example.com (Password: password123)');

    await Client.bulkCreate([
      {
        userId: user.id,
        name: 'Stark Industries',
        email: 'tony@stark.com',
        address: '10880 Malibu Point, CA',
        phone: '555-0199'
      },
      {
        userId: user.id,
        name: 'Wayne Enterprises',
        email: 'bruce@wayne.com',
        address: '1007 Mountain Drive, Gotham',
        phone: '555-0100'
      }
    ]);
    console.log('✅ Dummy Clients created.');

    await Product.bulkCreate([
      {
        userId: user.id,
        name: 'Web Design Retainer',
        unitPrice: 1500.00,
        taxRate: 10.00
      },
      {
        userId: user.id,
        name: 'SEO Audit',
        unitPrice: 500.00,
        taxRate: 0.00
      },
      {
        userId: user.id,
        name: 'Server Hosting (Monthly)',
        unitPrice: 50.00,
        taxRate: 5.00
      }
    ]);
    console.log('✅ Dummy Products created.');

    await Template.create({
      userId: user.id,
      name: 'Modern Blue',
      branding: {
        logoUrl: '',
        primaryColor: '#4f46e5',
        fontFamily: 'Inter, sans-serif'
      },
      fields: {
        showTax: true,
        showDiscount: false,
        notesLabel: 'Terms & Conditions'
      }
    });
    console.log('✅ Dummy Templates created.');

    console.log('\n🎉 Seeding complete! You can now log in with admin@example.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();
