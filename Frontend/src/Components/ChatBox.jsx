import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMessages, addMessage } from '../features/chat/chatSlice';
import { io } from 'socket.io-client';
import { FaInfoCircle, FaRegImage, FaRegHeart } from 'react-icons/fa'; 

const ChatBox = ({ selectedUser }) => {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);
  const [message, setMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.emit('userOnline', user._id);

    newSocket.on('receiveMessage', (newMessage) => {
      dispatch(addMessage(newMessage));
    });

    return () => {
      newSocket.close();
    };
  }, [user._id, dispatch]);

  useEffect(() => {
    if (selectedUser) {
      dispatch(fetchMessages(selectedUser._id));
    }
  }, [selectedUser, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;

    socket.emit('sendMessage', {
      senderId: user._id,
      receiverId: selectedUser._id,
      message: message.trim()
    });

    setMessage('');
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white text-center p-4">
        <div className="w-24 h-24 border-2 border-black rounded-full flex items-center justify-center mb-4">
            <FaRegHeart className="text-4xl" />
        </div>
        <h2 className="text-xl font-normal text-[#262626]">Your messages</h2>
        <p className="text-[#737373] text-sm mt-1">Send a photo or message to a friend.</p>
        <button className="mt-4 bg-[#0095f6] hover:bg-[#1877f2] text-white px-4 py-2 .rounded-[8px] text-sm font-semibold transition">
            Send message
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white border-l border-[#dbdbdb]">
      <header className="p-4 border-b border-[#dbdbdb] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={selectedUser.profilePicture || 'https://via.placeholder.com/150'}
            alt={selectedUser.username}
            className="w-11 h-11 rounded-full object-cover border border-[#dbdbdb]"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-base text-[#262626] leading-tight">
              {selectedUser.username}
            </span>
            <span className="text-[12px] text-[#737373]">Active now</span>
          </div>
        </div>
        <FaInfoCircle className="text-xl cursor-pointer hover:text-gray-400" />
      </header>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender._id === user._id ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-2.5 rounded-[22px] text-sm  ${
                msg.sender._id === user._id
                  ? 'bg-[#0095f6] text-white'
                  : 'bg-[#efefef] text-[#262626]'
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4">
        <form
          onSubmit={handleSend}
          className="flex items-center gap-3 border border-[#dbdbdb] .rounded-[24px] px-4 py-2 focus-within:ring-1 ring-gray-200"
        >
          <div className="flex gap-3 text-2xl text-[#262626]">
            <FaRegImage className="cursor-pointer hover:text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 py-1 text-sm outline-none placeholder:text-[#737373]"
          />
          {message.trim() ? (
            <button
              type="submit"
              className="text-[#0095f6] font-bold text-sm hover:text-[#00376b] transition"
            >
              Send
            </button>
          ) : (
             <FaRegHeart className="text-2xl cursor-pointer hover:text-gray-500" />
          )}
        </form>
      </div>
    </div>
  );
};

export default ChatBox;