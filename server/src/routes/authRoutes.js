import { Router } from 'express';
import {
  forgotPassword,
  getMe,
  login,
  register,
  resetPassword,
  updateMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateForgotPassword,
  validateLogin,
  validateRegister,
  validateResetPassword,
  validateUpdateProfile,
} from '../middleware/validateAuth.js';

const router = Router();

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.get('/me', protect, getMe);
router.put('/me', protect, validateUpdateProfile, updateMe);
router.post('/forgotpassword', validateForgotPassword, forgotPassword);
router.put(
  '/resetpassword/:token',
  validateResetPassword,
  resetPassword,
);

export default router;
