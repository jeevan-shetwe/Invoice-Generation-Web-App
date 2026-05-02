import { User } from '../models/index.js';

export class UserService {
  static async getProfile(userId) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['passwordHash'] }
    });
    if (!user) throw new Error('User not found');
    return user;
  }

  static async updateProfile(userId, data) {
    const user = await User.findByPk(userId);
    if (!user) throw new Error('User not found');
    
    // Whitelist fields to prevent accidental updates of sensitive fields like password
    const allowedFields = ['companyName', 'phone', 'address', 'website', 'logoUrl', 'currency'];
    const updateData = {};
    
    Object.keys(data).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = data[key];
      }
    });

    await user.update(updateData);
    return user;
  }
}
