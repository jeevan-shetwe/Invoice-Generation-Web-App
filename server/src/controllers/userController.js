import { UserService } from '../services/userService.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

export const getProfile = async (req, res) => {
  try {
    const user = await UserService.getProfile(req.user.id);
    sendSuccess(res, user, 200, 'Profile retrieved');
  } catch (err) {
    sendError(res, err.message, 500);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await UserService.updateProfile(req.user.id, req.body);
    sendSuccess(res, user, 200, 'Profile updated');
  } catch (err) {
    sendError(res, err.message, 400);
  }
};

export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) throw new Error('No file uploaded');
    
    // Cloudinary returns the full URL in req.file.path
    const logoUrl = req.file.path;
    await UserService.updateProfile(req.user.id, { logoUrl });
    
    sendSuccess(res, { logoUrl }, 200, 'Logo uploaded successfully');
  } catch (err) {
    sendError(res, err.message, 400);
  }
};
