const express = require('express');
const { createChat, getMessages } = require('../controllers/chat.controller');
const protect = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/', protect, createChat);
router.get('/:userId', protect, getMessages);

module.exports = router;