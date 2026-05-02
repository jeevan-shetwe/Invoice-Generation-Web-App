import { InvoiceService } from '../services/invoiceService.js';
import { EmailService } from '../services/emailService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getAllInvoices = async (req, res) => {
  try {
    const userId = req.user.id;
    const invoices = await InvoiceService.getAllInvoices(userId);
    sendSuccess(res, invoices, 200, 'Invoices retrieved successfully');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const invoice = await InvoiceService.getById(id, userId);
    if (!invoice) return sendError(res, 'Invoice not found', 404);
    sendSuccess(res, invoice, 200, 'Invoice retrieved');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const createInvoice = async (req, res) => {
  try {
    const userId = req.user.id;
    const createdInvoice = await InvoiceService.createFullInvoice(req.body, userId);
    sendSuccess(res, createdInvoice, 201, 'Invoice created successfully');
  } catch (error) {
    const statusCode = error.message.includes('not found') ? 404 : 400;
    sendError(res, error.message, statusCode);
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updated = await InvoiceService.updateDraftInvoice(id, userId, req.body);
    sendSuccess(res, updated, 200, 'Invoice updated successfully');
  } catch (error) {
    const statusCode = error.message === 'Invoice not found' ? 404
      : error.message.includes('Only Draft') ? 403 : 400;
    sendError(res, error.message, statusCode);
  }
};

export const updateInvoiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const updatedInvoice = await InvoiceService.updateStatus(id, status, userId);
    sendSuccess(res, updatedInvoice, 200, 'Invoice status updated');
  } catch (error) {
    const statusCode = error.message === 'Invoice not found' ? 404 : 400;
    sendError(res, error.message, statusCode);
  }
};

export const sendInvoiceEmailController = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Fetch invoice to ensure it exists and get client email
    const invoice = await InvoiceService.getAllInvoices(userId).then(
      invoices => invoices.find(i => i.id === parseInt(id))
    );

    if (!invoice) return sendError(res, 'Invoice not found', 404);
    if (!invoice.client || !invoice.client.email) {
      return sendError(res, 'Client has no email address configured', 400);
    }
    if (!req.file) {
      return sendError(res, 'PDF file is required', 400);
    }

    await EmailService.sendInvoiceEmail(invoice.client.email, invoice.invoiceNumber, req.file.buffer);
    
    // Auto-update status to Finalised if it's currently Draft (optional business logic)
    if (invoice.status === 'Draft') {
      await InvoiceService.updateStatus(id, 'Finalised', userId);
    }

    sendSuccess(res, null, 200, 'Invoice sent successfully');
  } catch (error) {
    sendError(res, error.message, 500);
  }
};

export const getInvoiceAuditLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const logs = await InvoiceService.getAuditLogs(id, userId);
    sendSuccess(res, logs, 200, 'Audit logs retrieved');
  } catch (error) {
    const statusCode = error.message === 'Invoice not found' ? 404 : 500;
    sendError(res, error.message, statusCode);
  }
};
