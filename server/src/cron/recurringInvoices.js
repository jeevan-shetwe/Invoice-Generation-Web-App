import cron from 'node-cron';
import { Op } from 'sequelize';
import { Invoice, InvoiceItem } from '../models/index.js';
import { InvoiceService } from '../services/invoiceService.js';
import sequelize from '../config/database.js';

export const setupCronJobs = () => {
  // Run daily at midnight to check for recurring invoices
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily recurring invoice check...');
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoString = thirtyDaysAgo.toISOString().split('T')[0];

      const recurringInvoices = await Invoice.findAll({
        where: {
          isRecurring: true,
          status: { [Op.ne]: 'Cancelled' },
          [Op.or]: [
            { lastRecurrenceDate: { [Op.lte]: thirtyDaysAgoString } },
            { 
              lastRecurrenceDate: null, 
              issueDate: { [Op.lte]: thirtyDaysAgoString }
            }
          ]
        },
        include: ['items']
      });

      for (const invoice of recurringInvoices) {
        const transaction = await sequelize.transaction();
        try {
          const currentYear = new Date().getFullYear();
          const newInvoiceNumber = await InvoiceService.generateInvoiceNumber(invoice.userId, currentYear);
          
          const today = new Date().toISOString().split('T')[0];
          
          const newInvoice = await Invoice.create({
            userId: invoice.userId,
            clientId: invoice.clientId,
            invoiceNumber: newInvoiceNumber,
            status: 'Draft',
            issueDate: today,
            dueDate: today, // Due upon receipt for generated recurring
            subtotal: invoice.subtotal,
            taxTotal: invoice.taxTotal,
            grandTotal: invoice.grandTotal,
            templateSnapshot: invoice.templateSnapshot,
            isRecurring: false // Child is not recurring, parent acts as generator
          }, { transaction });

          const newItems = invoice.items.map(item => ({
            invoiceId: newInvoice.id,
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxRate: item.taxRate,
            total: item.total
          }));

          await InvoiceItem.bulkCreate(newItems, { transaction });
          
          invoice.lastRecurrenceDate = today;
          await invoice.save({ transaction });

          await transaction.commit();
          console.log(`Generated recurring invoice ${newInvoiceNumber} from parent ${invoice.invoiceNumber}`);
        } catch (err) {
          await transaction.rollback();
          console.error(`Failed to generate recurring invoice for ${invoice.id}:`, err);
        }
      }
    } catch (error) {
      console.error('Cron Job Error:', error);
    }
  });
};
