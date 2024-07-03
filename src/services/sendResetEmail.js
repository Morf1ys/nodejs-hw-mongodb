import nodemailer from 'nodemailer';
import {
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  SMTP_FROM,
  APP_DOMAIN,
  JWT_SECRET,
} from '../config/index.js';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../db/userModel.js';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

export const sendResetEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw createError(404, 'User not found!');

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '5m' });
  const resetUrl = `${APP_DOMAIN}/reset-password?token=${token}`;

  const mailOptions = {
    from: SMTP_FROM,
    to: email,
    subject: 'Password Reset',
    text: `Click this link to reset your password: ${resetUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw createError(500, 'Failed to send the email, please try again later.');
  }
};
