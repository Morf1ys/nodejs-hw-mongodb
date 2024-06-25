import {
  createUser,
  authenticateUser,
  refreshToken,
  logoutUser,
} from '../services/auth.js';
import createError from 'http-errors';

export const register = async (req, res, next) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully registered a user!',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const tokens = await authenticateUser(req.body);
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
    res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken: tokens.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      throw createError(401, 'Refresh token missing');
    }
    const tokens = await refreshToken(token);
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
    res.status(200).json({
      status: 200,
      message: 'Successfully refreshed a session!',
      data: { accessToken: tokens.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      throw createError(401, 'Refresh token missing');
    }
    await logoutUser(token);
    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
