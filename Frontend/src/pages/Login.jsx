import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login, clearError } from '../features/auth/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) navigate('/');
    return () => dispatch(clearError());
  }, [user, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] p-4">
      <div className="bg-white border border-[#dbdbdb] rounded-sm pt-10 pb-6 px-10 max-w-[350px] w-full mb-3">
        <h1 className="text-center mb-8">
            <span className="italic font-bold text-4xl tracking-tighter text-gray-800" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                Instagram
            </span>
        </h1>

        {error && (
          <div className="text-red-600 mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            name="email"
            placeholder="Phone number, username, or email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2.5 border border-[#dbdbdb] rounded-[3px] text-xs outline-none bg-[#fafafa] focus:border-gray-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2.5 border border-[#dbdbdb] rounded-[3px] text-xs outline-none bg-[#fafafa] focus:border-gray-400"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 p-1.5 bg-[#0095f6] hover:bg-[#1877f2] text-white .rounded-[8px] text-sm font-semibold transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>

          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-[#dbdbdb]"></div>
            <p className="mx-4 text-[13px] font-semibold text-gray-400">OR</p>
            <div className="flex-1 h-px bg-[#dbdbdb]"></div>
          </div>

          <button type="button" className="text-[#385185] text-sm font-semibold mb-2">
            Log in with Facebook
          </button>
          
          <p className="text-center text-xs text-[#00376b] cursor-pointer">Forgot password?</p>
        </form>
      </div>

      <div className="bg-white border border-[#dbdbdb] rounded-sm p-6 max-w-[350px] w-full text-center">
        <p className="text-sm text-gray-900">
          Don't have an account? <Link to="/register" className="text-[#0095f6] font-semibold no-underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;