import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User, Session } from '../db/userModel.js';
import { JWT_SECRET, JWT_REFRESH_SECRET } from '../config/index.js';

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  ); // 30 days

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const createUser = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw createError(409, 'Email in use');

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();

  return user.toObject({
    versionKey: false,
    transform: (_, ret) => {
      delete ret.password;
    },
  });
};

export const authenticateUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createError(401, 'Invalid email or password');
  }

  const {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  } = generateTokens(user._id);

  await Session.findOneAndDelete({ userId: user._id });
  await new Session({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  }).save();

  return { accessToken, refreshToken };
};

export const refreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
    const session = await Session.findOne({
      userId: decoded.userId,
      refreshToken: token,
    });

    if (!session || session.refreshTokenValidUntil < new Date()) {
      throw createError(401, 'Refresh token expired or invalid');
    }

    const {
      accessToken,
      refreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    } = generateTokens(decoded.userId);

    await Session.findOneAndDelete({ userId: decoded.userId });
    await new Session({
      userId: decoded.userId,
      accessToken,
      refreshToken,
      accessTokenValidUntil,
      refreshTokenValidUntil,
    }).save();

    return { accessToken, refreshToken };
  } catch (error) {
    throw createError(401, 'Invalid refresh token');
  }
};

export const logoutUser = async (token) => {
  const decoded = jwt.verify(token, JWT_REFRESH_SECRET);
  await Session.findOneAndDelete({
    userId: decoded.userId,
    refreshToken: token,
  });
};
