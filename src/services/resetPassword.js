import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import bcrypt from 'bcryptjs';
import { User, Session } from '../db/userModel.js';
import { JWT_SECRET } from '../config/index.js';

export const resetPassword = async (token, password) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });
    if (!user) throw createError(404, 'User not found!');

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    await Session.findOneAndDelete({ userId: user._id });
  } catch (error) {
    throw createError(401, 'Token is expired or invalid.');
  }
};
