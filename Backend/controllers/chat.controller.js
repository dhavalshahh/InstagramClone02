const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

const createChat = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;

    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] }
    }).populate('participants', 'username profilePicture');

    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiverId]
      });
      chat = await chat.populate('participants', 'username profilePicture');
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const chat = await Chat.findOne({
      participants: { $all: [currentUserId, userId] }
    }).populate({
      path: 'messages',
      populate: {
        path: 'sender receiver',
        select: 'username profilePicture'
      }
    });

    if (!chat) {
      return res.json({ messages: [] });
    }

    res.json({ messages: chat.messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (senderId, receiverId, messageText) => {
  try {
    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      message: messageText
    });

    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [senderId, receiverId]
      });
    }

    chat.messages.push(message._id);
    await chat.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username profilePicture')
      .populate('receiver', 'username profilePicture');

    return populatedMessage;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

module.exports = {
  createChat,
  getMessages,
  sendMessage
};