import { Router } from 'express';
import {
  changeCurrentUserPassword,
  deleteCurrentUserAvatar,
  updateCurrentUser,
  uploadCurrentUserAvatar,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  handleAvatarUploadError,
  uploadAvatarMiddleware,
} from '../middleware/uploadAvatar.js';

const router = Router();

router.put('/me', protect, updateCurrentUser);
router.put('/me/password', protect, changeCurrentUserPassword);

router.post(
  '/me/avatar',
  protect,
  (req, res, next) => {
    uploadAvatarMiddleware(req, res, (err) => {
      handleAvatarUploadError(err, req, res, next);
    });
  },
  uploadCurrentUserAvatar,
);

router.delete('/me/avatar', protect, deleteCurrentUserAvatar);

export default router;
