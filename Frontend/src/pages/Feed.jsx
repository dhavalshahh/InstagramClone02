import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPosts, addPost } from '../features/post/postSlice';
import PostCard from '../Components/PostCard.jsx';
import { FaPlus, FaTimes, FaImage } from 'react-icons/fa';

const Feed = () => {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector((state) => state.post);
  const { user } = useSelector((state) => state.auth);

  const [showModal, setShowModal] = useState(false);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    dispatch(fetchAllPosts());
  }, [dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) {
      alert('Please select an image');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('caption', caption);

    dispatch(addPost(formData));
    setShowModal(false);
    setCaption('');
    setImage(null);
    setImagePreview('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#262626]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-8">
      <div className="max-w-[470px] mx-auto px-2">
        
        {user && (
          <div 
            onClick={() => setShowModal(true)}
            className="bg-white border border-[#dbdbdb] rounded-lg p-4 mb-8 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition"
          >
            <div className="w-10 h-10 rounded-full .bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 ">
                <img 
                    src={user.profilePicture || 'https://via.placeholder.com/150'} 
                    className="w-full h-full rounded-full object-cover border-2 border-white" 
                    alt="user"
                />
            </div>
            <span className="text-[#737373] text-sm">What's on your mind, {user.username}?</span>
            <div className="ml-auto text-[#0095f6] font-bold text-sm">Post</div>
          </div>
        )}

        <div className="flex flex-col gap-4">
            {posts.length === 0 ? (
            <div className="bg-white border border-[#dbdbdb] rounded-lg p-10 text-center">
                <p className="text-[#262626] font-semibold text-lg">No posts yet.</p>
                {user && <p className="text-[#737373] text-sm">Start following people or create your first post!</p>}
            </div>
            ) : (
            posts.map((post) => <PostCard key={post._id} post={post} />)
            )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-xl max-w-[500px] w-full overflow-hidden shadow-2xl">
            <div className="p-3 border-b border-[#dbdbdb] flex justify-between items-center px-4">
              <button onClick={() => setShowModal(false)} className="text-sm font-semibold">Cancel</button>
              <h2 className="text-sm font-bold">Create new post</h2>
              <button 
                onClick={handleSubmit} 
                disabled={!image}
                className={`text-sm font-bold ${image ? 'text-[#0095f6]' : 'text-gray-300'}`}
              >
                Share
              </button>
            </div>

            <div className="flex flex-col">
              <div className="relative aspect-square bg-[#fafafa] flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover animate-in zoom-in-95 duration-300"
                  />
                ) : (
                  <label className="flex flex-col items-center cursor-pointer">
                    <FaImage className="text-5xl text-[#262626] mb-4" />
                    <span className="text-lg font-light">Select photos and videos here</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="mt-6 bg-[#0095f6] text-white text-sm font-bold py-1.5 px-3 rounded-lg hover:bg-[#1877f2]">
                        Select from computer
                    </div>
                  </label>
                )}
              </div>

              <div className="p-4 border-t border-[#dbdbdb]">
                <div className="flex items-center gap-2 mb-3">
                    <img src={user?.profilePicture} className="w-7 h-7 rounded-full object-cover" alt="" />
                    <span className="text-sm font-bold">{user?.username}</span>
                </div>
                <textarea
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full min-h-[120px] text-sm outline-none resize-none placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;