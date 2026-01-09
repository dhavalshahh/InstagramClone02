const express = require('express');
const {
  createPost,
  getAllPosts,
  deletePost,
  likePost,
  unlikePost
} = require('../controllers/post.controller');
const protect = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

const router = express.Router();

router.post('/', protect, upload.single('image'), createPost);
router.get('/', getAllPosts);
router.delete('/:id', protect, deletePost);
router.put('/like/:id', protect, likePost);
router.put('/unlike/:id', protect, unlikePost);

module.exports = router;