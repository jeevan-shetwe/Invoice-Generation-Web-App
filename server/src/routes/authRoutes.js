import express from 'express';
import { register, login, forgotPassword, resetPassword, refresh, logout } from '../controllers/authController.js';
import { validate } from '../middleware/validate.js';
import { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema } from '../validations/auth.validation.js';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', (req, res, next) => {
  if (!req.body.refreshToken) return res.status(400).json({ success: false, error: 'Refresh token is required' });
  next();
}, refresh);
router.post('/logout', (req, res, next) => {
  if (!req.body.refreshToken) return res.status(400).json({ success: false, error: 'Refresh token is required' });
  next();
}, logout);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

export default router;
