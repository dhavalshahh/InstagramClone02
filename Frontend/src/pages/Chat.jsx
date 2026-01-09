import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ChatBox from '../Components/ChatBox.jsx';
import { getAllPosts } from '../services/api';

const Chat = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { onlineUsers } = useSelector((state) => state.chat);
  
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const { data } = await getAllPosts();
        const uniqueUsers = new Map();
        
        data.forEach(post => {
          if (post.author._id !== user._id) {
            uniqueUsers.set(post.author._id, post.author);
          }
        });
        
        setUsers(Array.from(uniqueUsers.values()));
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="h-[calc(100vh-60px)] flex bg-white">
      <div className="w-[350px] border-r border-ig-border overflow-y-auto">
        <div className="p-5 border-b border-ig-border">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        
        {users.length === 0 ? (
          <div className="py-10 px-5 text-center text-ig-gray">
            No users found. Follow some users or interact with posts!
          </div>
        ) : (
          <div>
            {users.map((u) => (
              <div
                key={u._id}
                onClick={() => setSelectedUser(u)}
                className={`p-3 px-5 flex items-center gap-3 cursor-pointer border-b border-gray-100 transition ${
                  selectedUser?._id === u._id ? 'bg-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <div className="relative">
                  <img
                    src={u.profilePicture}
                    alt={u.username}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  {onlineUsers.includes(u._id) && (
                    <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    {u.username}
                  </div>
                  {onlineUsers.includes(u._id) && (
                    <div className="text-xs text-green-500">
                      Active now
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ChatBox selectedUser={selectedUser} />
    </div>
  );
};

export default Chat;