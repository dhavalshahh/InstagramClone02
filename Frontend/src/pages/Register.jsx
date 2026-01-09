import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../features/auth/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
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
    dispatch(register(formData));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] p-4">
      <div className="bg-white border border-[#dbdbdb] rounded-sm pt-10 pb-6 px-10 max-w-[350px] w-full mb-3">
        <h1 className="text-center mb-4">
          <span className="italic font-bold text-4xl tracking-tighter text-gray-800" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
            Instagram
          </span>
        </h1>

        <p className="text-center text-[#737373] text-[17px] font-bold leading-5 mb-5">
          Sign up to see photos and videos from your friends.
        </p>

        <button type="button" className="w-full flex items-center justify-center gap-2 mb-4 p-1.5 bg-[#0095f6] hover:bg-[#1877f2] text-white .rounded-[8px] text-sm font-semibold transition-colors">
          <span className="text-lg">f</span> Log in with Facebook
        </button>

        <div className="flex items-center mb-4">
          <div className="flex-1 .h-[1px] bg-[#dbdbdb]"></div>
          <p className="mx-4 text-[13px] font-semibold text-[#737373]">OR</p>
          <div className="flex-1 .h-[1px] bg-[#dbdbdb]"></div>
        </div>

        {error && (
          <div className="text-red-600 mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2.5 border border-[#dbdbdb] rounded-[3px] text-xs outline-none bg-[#fafafa] focus:border-gray-400"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
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
            minLength="6"
            className="w-full p-2.5 border border-[#dbdbdb] rounded-[3px] text-xs outline-none bg-[#fafafa] focus:border-gray-400"
          />

          <p className="text-center text-[#737373] text-[12px] my-3">
            People who use our service may have uploaded your contact information to Instagram. <span className="text-[#00376b] cursor-pointer">Learn More</span>
          </p>

          <p className="text-center text-[#737373] text-[12px] mb-4">
            By signing up, you agree to our <span className="text-[#00376b] cursor-pointer">Terms</span>, <span className="text-[#00376b] cursor-pointer">Privacy Policy</span> and <span className="text-[#00376b] cursor-pointer">Cookies Policy</span>.
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-1.5 bg-[#0095f6] hover:bg-[#1877f2] text-white .rounded-[8px] text-sm font-semibold transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
      </div>

      <div className="bg-white border border-[#dbdbdb] rounded-sm p-6 max-w-[350px] w-full text-center">
        <p className="text-sm text-gray-900">
          Have an account? <Link to="/login" className="text-[#0095f6] font-semibold no-underline">Log in</Link>
        </p>
      </div>

      <div className="text-center mt-4">
        <p className="text-sm mb-4">Get the app.</p>
        <div className="flex gap-2 justify-center">
          <img className="h-10 cursor-pointer" src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7YmSByL.png" alt="Google Play" />
          <img className="h-10 cursor-pointer" src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png" alt="Microsoft" />
        </div>
      </div>
    </div>
  );
};

export default Register;