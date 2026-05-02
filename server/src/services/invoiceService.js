import { Op } from 'sequelize';
import { Invoice, InvoiceItem, Template, InvoiceAuditLog, Client } from '../models/index.js';
import sequelize from '../config/database.js';

export class InvoiceService {
  /**
   * Generates a unique sequential invoice number for a user.
   * Format: INV-YYYY-XXXX (e.g. INV-2025-0001)
   */
  static async generateInvoiceNumber(userId, year) {
    const prefix = `INV-${year}-`;
    
    // Find the latest invoice for this user in this year
    const lastInvoice = await Invoice.findOne({
      where: {
        userId,
        invoiceNumber: {
          [Op.like]: `${prefix}%`
        }
      },
      order: [['invoiceNumber', 'DESC']],
    });

    if (!lastInvoice) {
      return `${prefix}0001`;
    }

    // Extract the numeric part and increment
    const lastSequence = parseInt(lastInvoice.invoiceNumber.replace(prefix, ''), 10);
    const nextSequence = (lastSequence + 1).toString().padStart(4, '0');
    
    return `${prefix}${nextSequence}`;
  }

  /**
   * Calculates subtotal, taxTotal, and grandTotal based on items.
   */
  static calculateTotals(items) {
    let subtotal = 0;
    let taxTotal = 0;

    items.forEach(item => {
      const itemTotal = item.quantity * item.unitPrice;
      subtotal += itemTotal;
      taxTotal += itemTotal * (item.taxRate / 100);
    });

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      taxTotal: parseFloat(taxTotal.toFixed(2)),
      grandTotal: parseFloat((subtotal + taxTotal).toFixed(2))
    };
  }

  /**
   * Get all invoices
   */
  static async getAllInvoices(userId) {
    const invoices = await Invoice.findAll({
      where: { userId },
      include: ['items', 'client'],
      order: [['createdAt', 'DESC']]
    });

    return invoices.map(invoice => {
      const plain = invoice.get({ plain: true });
      if (!plain.client && plain.clientSnapshot) {
        plain.client = plain.clientSnapshot;
      }
      return plain;
    });
  }

  static async getById(invoiceId, userId) {
    const invoice = await Invoice.findOne({
      where: { id: invoiceId, userId },
      include: ['items', 'client']
    });

    if (!invoice) return null;

    const plain = invoice.get({ plain: true });
    if (!plain.client && plain.clientSnapshot) {
      plain.client = plain.clientSnapshot;
    }
    return plain;
  }

  static async updateDraftInvoice(invoiceId, userId, data) {
    const invoice = await Invoice.findOne({
      where: { id: invoiceId, userId },
      include: ['items']
    });
    if (!invoice) throw new Error('Invoice not found');
    if (invoice.status !== 'Draft') throw new Error('Only Draft invoices can be edited');

    const t = await sequelize.transaction();
    try {
      // Update header fields
      const client = await Client.findOne({ where: { id: data.clientId, userId } });
      const clientSnapshot = client ? {
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address
      } : null;

      await invoice.update({
        clientId: data.clientId,
        templateId: data.templateId,
        issueDate: data.issueDate,
        dueDate: data.dueDate || null,
        isRecurring: data.isRecurring || false,
        recurringInterval: data.isRecurring ? data.recurringInterval : null,
        recurringIntervalValue: data.isRecurring ? data.recurringIntervalValue : null,
        nextRecurrenceDate: (data.isRecurring && data.nextRecurrenceDate) ? data.nextRecurrenceDate : null,
        clientSnapshot
      }, { transaction: t });

      // Delete old items and recreate
      await InvoiceItem.destroy({ where: { invoiceId: invoice.id }, transaction: t });

      let subtotal = 0, taxTotal = 0;
      for (const item of data.items) {
        const lineSubtotal = item.quantity * item.unitPrice;
        const lineTax = lineSubtotal * (item.taxRate / 100);
        subtotal += lineSubtotal;
        taxTotal += lineTax;
        await InvoiceItem.create({
          invoiceId: invoice.id,
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate,
          total: lineSubtotal + lineTax,
        }, { transaction: t });
      }

      await invoice.update({ subtotal, taxTotal, grandTotal: subtotal + taxTotal }, { transaction: t });
      await t.commit();
      return await this.getById(invoiceId, userId);
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  /**
   * Transition an invoice from Draft to Finalised
   * Rules:
   * - Cannot finalise an already finalised, paid, or cancelled invoice.
   * - Requires a template snapshot if not already present.
   */
  static async finaliseInvoice(invoiceId, userId) {
    const invoice = await Invoice.findOne({
      where: { id: invoiceId, userId },
      include: ['items']
    });

    if (!invoice) throw new Error('Invoice not found');
    if (invoice.status !== 'Draft') throw new Error(`Cannot finalise invoice in ${invoice.status} status.`);
    
    const oldStatus = invoice.status;
    invoice.status = 'Finalised';
    await invoice.save();
    
    await InvoiceAuditLog.create({
      invoiceId: invoice.id,
      userId,
      oldStatus,
      newStatus: 'Finalised'
    });
    
    return invoice;
  }

  static async updateStatus(invoiceId, status, userId) {
    if (status === 'Finalised') {
      return await this.finaliseInvoice(invoiceId, userId);
    }

    const invoice = await Invoice.findOne({ where: { id: invoiceId, userId } });
    if (!invoice) throw new Error('Invoice not found');
    
    if (invoice.status === 'Finalised' && status === 'Draft') {
      throw new Error('Cannot revert finalised invoice to draft.');
    }

    const oldStatus = invoice.status;
    invoice.status = status;
    await invoice.save();

    await InvoiceAuditLog.create({
      invoiceId: invoice.id,
      userId,
      oldStatus,
      newStatus: status
    });

    return invoice;
  }

  static async createFullInvoice(payload, userId) {
    const transaction = await sequelize.transaction();
    try {
      const { clientId, templateId, issueDate, dueDate, items, isRecurring, recurringInterval, recurringIntervalValue, nextRecurrenceDate } = payload;

      const user = await sequelize.models.User.findByPk(userId);
      const currency = user?.currency || 'USD';

      const template = await Template.findOne({ where: { id: templateId } });
      if (!template) {
        throw new Error('Template not found');
      }

      const currentYear = new Date().getFullYear();
      const invoiceNumber = await this.generateInvoiceNumber(userId, currentYear);

      const { subtotal, taxTotal, grandTotal } = this.calculateTotals(items);

      const client = await Client.findOne({ where: { id: clientId, userId } });
      const clientSnapshot = client ? {
        name: client.name,
        email: client.email,
        phone: client.phone,
        address: client.address
      } : null;

      const invoice = await Invoice.create({
        userId,
        clientId,
        invoiceNumber,
        status: 'Draft',
        currency,
        issueDate,
        dueDate,
        subtotal,
        taxTotal,
        grandTotal,
        templateSnapshot: {
          branding: template.branding,
          fields: template.fields
        },
        clientSnapshot,
        isRecurring: isRecurring || false,
        recurringInterval: isRecurring ? recurringInterval : null,
        recurringIntervalValue: isRecurring ? recurringIntervalValue : null,
        nextRecurrenceDate: (isRecurring && nextRecurrenceDate) ? nextRecurrenceDate : null
      }, { transaction });

      const invoiceItemsData = items.map(item => ({
        invoiceId: invoice.id,
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        taxRate: item.taxRate,
        total: item.quantity * item.unitPrice * (1 + item.taxRate / 100)
      }));

      await InvoiceItem.bulkCreate(invoiceItemsData, { transaction });
      
      await InvoiceAuditLog.create({
        invoiceId: invoice.id,
        userId,
        oldStatus: null,
        newStatus: 'Draft'
      }, { transaction });

      await transaction.commit();

      return await Invoice.findByPk(invoice.id, { include: ['items', 'client'] });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  static async getAuditLogs(invoiceId, userId) {
    const invoice = await Invoice.findOne({ where: { id: invoiceId, userId } });
    if (!invoice) throw new Error('Invoice not found');

    return await InvoiceAuditLog.findAll({
      where: { invoiceId },
      include: ['user'],
      order: [['createdAt', 'DESC']]
    });
  }
}
