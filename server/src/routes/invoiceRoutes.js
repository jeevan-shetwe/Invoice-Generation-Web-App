import express from 'express';
import { getAllInvoices, getInvoiceById, createInvoice, updateInvoice, updateInvoiceStatus, sendInvoiceEmailController, getInvoiceAuditLogs } from '../controllers/invoiceController.js';
import { validate } from '../middleware/validate.js';
import { invoiceCreateSchema, invoiceStatusSchema } from '../validations/invoice.validation.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.get('/', getAllInvoices);
router.post('/', validate(invoiceCreateSchema), createInvoice);
router.get('/:id', getInvoiceById);
router.put('/:id', validate(invoiceCreateSchema), updateInvoice);
router.patch('/:id/status', validate(invoiceStatusSchema), updateInvoiceStatus);
router.post('/:id/send', upload.single('invoicePdf'), sendInvoiceEmailController);
router.get('/:id/audit', getInvoiceAuditLogs);

export default router;
