import express from 'express';
import { register, login, refresh, logout } from '../controllers/auth.js';
import { validateBody } from '../middleware/validateBody.js';
import { registerSchema, loginSchema } from '../schemas/authSchemas.js';
import { resetEmailSchema } from '../schemas/resetEmailSchema.js';
import { resetPasswordSchema } from '../schemas/resetPasswordSchema.js';
import { sendResetEmail } from '../services/sendResetEmail.js';
import { resetPassword } from '../services/resetPassword.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post(
  '/send-reset-email',
  validateBody(resetEmailSchema),
  async (req, res, next) => {
    try {
      await sendResetEmail(req.body.email);
      res.status(200).json({
        status: 200,
        message: 'Reset password email has been successfully sent.',
        data: {},
      });
    } catch (error) {
      next(error);
    }
  },
);
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  async (req, res, next) => {
    try {
      await resetPassword(req.body.token, req.body.password);
      res.status(200).json({
        status: 200,
        message: 'Password has been successfully reset.',
        data: {},
      });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
