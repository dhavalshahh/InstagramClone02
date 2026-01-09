const express = require('express');
const {
  getUserProfile,
  updateProfile,
  followUser,
  unfollowUser
} = require('../controllers/user.controller');
const protect = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.get('/:id', getUserProfile);
router.put('/update', protect, upload.single('profilePicture'), updateProfile);
router.post('/follow/:id', protect, followUser);
router.post('/unfollow/:id', protect, unfollowUser);

module.exports = router;