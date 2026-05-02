import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { getProfile, updateProfile, uploadLogo } from '../controllers/userController.js';
import { updateProfileSchema } from '../validations/user.validation.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile);
router.post('/upload-logo', authenticate, upload.single('logo'), uploadLogo);

export default router;
