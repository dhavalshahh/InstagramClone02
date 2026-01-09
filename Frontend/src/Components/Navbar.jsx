import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { 
  FaHome, FaUser, FaComments, FaSignOutAlt, 
  FaSignInAlt, FaSearch, FaRegCompass, FaRegHeart, FaBars 
} from 'react-icons/fa';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="fixed left-0 top-0 h-screen w-[245px] bg-white border-r border-[#dbdbdb] flex flex-col px-3 pt-8 pb-5 z-50">
      <Link to="/" className="px-3 mb-10 block">
        <span className="italic font-bold text-2xl tracking-tighter text-gray-800" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
          Instagram
        </span>
      </Link>

      <div className="flex-1 flex flex-col gap-2">
        <SidebarLink to="/" icon={<FaHome />} label="Home" active={isActive('/')} />
        
        <div className="flex items-center p-3 gap-4 hover:bg-[#fafafa] rounded-lg cursor-pointer transition group">
          <FaSearch className="text-2xl group-hover:scale-105 transition" />
          <span className="text-base text-[#262626]">Search</span>
        </div>

        <div className="flex items-center p-3 gap-4 hover:bg-[#fafafa] rounded-lg cursor-pointer transition group">
          <FaRegCompass className="text-2xl group-hover:scale-105 transition" />
          <span className="text-base text-[#262626]">Explore</span>
        </div>

        {user && (
          <>
            <SidebarLink to="/chat" icon={<FaComments />} label="Messages" active={isActive('/chat')} />
            
            <div className="flex items-center p-3 gap-4 hover:bg-[#fafafa] rounded-lg cursor-pointer transition group">
              <FaRegHeart className="text-2xl group-hover:scale-105 transition" />
              <span className="text-base text-[#262626]">Notifications</span>
            </div>

            <SidebarLink 
              to={`/profile/${user._id}`} 
              icon={
                user.profilePicture ? (
                  <img src={user.profilePicture} className="w-6 h-6 rounded-full object-cover" alt="avatar" />
                ) : (
                  <FaUser />
                )
              } 
              label="Profile" 
              active={isActive(`/profile/${user._id}`)} 
            />
          </>
        )}
      </div>

      <div className="mt-auto">
        {!user ? (
          <SidebarLink to="/login" icon={<FaSignInAlt />} label="Log In" active={isActive('/login')} />
        ) : (
          <>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center p-3 gap-4 hover:bg-[#fafafa] rounded-lg cursor-pointer transition group mb-2"
            >
              <FaSignOutAlt className="text-2xl group-hover:scale-105 transition" />
              <span className="text-base text-[#262626]">Log Out</span>
            </button>
            
            <div className="flex items-center p-3 gap-4 hover:bg-[#fafafa] rounded-lg cursor-pointer transition group">
              <FaBars className="text-2xl group-hover:scale-105 transition" />
              <span className="text-base text-[#262626]">More</span>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

const SidebarLink = ({ to, icon, label, active }) => (
  <Link to={to} className="flex items-center p-3 gap-4 hover:bg-[#fafafa] rounded-lg transition group">
    <span className={`text-2xl transition group-hover:scale-105 ${active ? 'scale-110 font-bold' : ''}`}>
      {icon}
    </span>
    <span className={`text-base text-[#262626] ${active ? 'font-bold' : 'font-normal'}`}>
      {label}
    </span>
  </Link>
);

export default Navbar;