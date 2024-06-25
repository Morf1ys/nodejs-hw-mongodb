import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User, Session } from '../db/userModel.js';
import { JWT_SECRET } from '../config/index.js';

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next(createError(401, 'Authorization header missing'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) throw createError(401, 'User not found');

    const session = await Session.findOne({
      userId: decoded.userId,
      accessToken: token,
    });
    if (!session) throw createError(401, 'Session not found or invalid');

    req.user = user;
    next();
  } catch (error) {
    next(createError(401, 'Access token expired or invalid'));
  }
};

export default authenticate;
