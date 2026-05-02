import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, RefreshToken } from '../models/index.js';
import { EmailService } from './emailService.js';
import dotenv from 'dotenv';
dotenv.config();

export const AuthService = {
  register: async (email, password, companyName) => {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ email, passwordHash, companyName });
    return user;
  },

  login: async (email, password) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new Error('Invalid credentials');

    // Access Token (Short-lived)
    const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '15m',
    });

    // Refresh Token (Long-lived)
    const refreshTokenValue = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Save Refresh Token to DB
    await RefreshToken.create({
      token: refreshTokenValue,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });

    return {
      accessToken,
      refreshToken: refreshTokenValue,
      user: {
        id: user.id,
        email: user.email,
        companyName: user.companyName
      }
    };
  },

  refresh: async (refreshTokenValue) => {
    try {
      const decoded = jwt.verify(refreshTokenValue, process.env.JWT_SECRET);

      const storedToken = await RefreshToken.findOne({
        where: {
          token: refreshTokenValue,
          userId: decoded.id,
          revokedAt: null
        },
        include: [{ model: User, as: 'user' }]
      });

      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new Error('Invalid or expired refresh token');
      }

      const user = storedToken.user;

      const newAccessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '15m',
      });

      return { accessToken: newAccessToken };
    } catch (err) {
      throw new Error('Unauthorized: Refresh token failed');
    }
  },

  logout: async (refreshTokenValue) => {
    await RefreshToken.update(
      { revokedAt: new Date() },
      { where: { token: refreshTokenValue } }
    );
    return true;
  },

  forgotPassword: async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error('No user found with this email');

    // Generate a short-lived token (2 mins)
    const resetToken = jwt.sign({ id: user.id, purpose: 'password_reset' }, process.env.JWT_SECRET, {
      expiresIn: '2m',
    });

    await EmailService.sendMagicLink(email, resetToken);
    return true;
  },

  resetPassword: async (token, newPassword) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.purpose !== 'password_reset') throw new Error('Invalid token type');

      const user = await User.findByPk(decoded.id);
      if (!user) throw new Error('User no longer exists');

      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(newPassword, salt);
      await user.save();

      return true;
    } catch (err) {
      if (err.name === 'TokenExpiredError') throw new Error('Reset link has expired');
      throw new Error('Invalid or corrupted reset link');
    }
  }
};
