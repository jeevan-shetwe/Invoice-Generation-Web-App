import { AuthService } from '../services/authService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const register = async (req, res) => {
  try {
    const { email, password, companyName } = req.body;
    const user = await AuthService.register(email, password, companyName);
    sendSuccess(res, { id: user.id, email: user.email }, 201, 'Registration successful');
  } catch (error) {
    sendError(res, error.message, 400);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await AuthService.login(email, password);
    sendSuccess(res, data, 200, 'Login successful');
  } catch (error) {
    sendError(res, error.message, 401);
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const data = await AuthService.refresh(refreshToken);
    sendSuccess(res, data, 200, 'Token refreshed');
  } catch (error) {
    sendError(res, error.message, 401);
  }
};

export const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    await AuthService.logout(refreshToken);
    sendSuccess(res, null, 200, 'Logged out successfully');
  } catch (error) {
    sendError(res, error.message, 400);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await AuthService.forgotPassword(email);
    sendSuccess(res, null, 200, 'Magic link sent to your email');
  } catch (error) {
    sendError(res, error.message, 400);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    await AuthService.resetPassword(token, password);
    sendSuccess(res, null, 200, 'Password reset successfully');
  } catch (error) {
    sendError(res, error.message, 400);
  }
};
