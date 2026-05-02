import express from 'express';
import { getTemplates, createTemplate, updateTemplate, deleteTemplate } from '../controllers/templateController.js';
import { validate } from '../middleware/validate.js';
import { templateSchema } from '../validations/template.validation.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getTemplates);
router.post('/', validate(templateSchema), createTemplate);
router.put('/:id', validate(templateSchema), updateTemplate);
router.delete('/:id', deleteTemplate);

router.post('/upload-logo', upload.single('logo'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
  res.json({ success: true, data: { logoUrl: req.file.path } });
});

export default router;
