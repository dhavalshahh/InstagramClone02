import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile, follow, unfollow } from '../features/user/userSlice';
import { FaEdit, FaCog } from 'react-icons/fa';

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  const [showEdit, setShowEdit] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    bio: ''
  });
  const [profilePic, setProfilePic] = useState(null);

  const isOwnProfile = user && user._id === id;
  const isFollowing = user && profile && profile.followers.includes(user._id);

  useEffect(() => {
    dispatch(fetchUserProfile(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username,
        bio: profile.bio
      });
    }
  }, [profile]);

  const handleFollow = () => {
    if (!user) {
      alert('Please login to follow users');
      return;
    }
    if (isFollowing) {
      dispatch(unfollow(id));
    } else {
      dispatch(follow(id));
    }
    dispatch(fetchUserProfile(id));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('username', formData.username);
    data.append('bio', formData.bio);
    if (profilePic) {
      data.append('profilePicture', profilePic);
    }
    dispatch(updateUserProfile(data));
    setShowEdit(false);
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-8">
      <div className="max-w-[935px] mx-auto px-4">

        <header className="flex flex-col sm:flex-row gap-8 sm:gap-20 items-center mb-12 pb-10 border-b border-[#dbdbdb]">
          <div className="w-[150px] h-[150px] .sm:w-[160px]">
            <img
              src={profile.profilePicture || 'https://via.placeholder.com/150'}
              alt={profile.username}
              className="w-full h-full rounded-full object-cover border border-[#dbdbdb] p-1"
            />
          </div>

          <section className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <h2 className="text-[28px] font-light text-[#262626]">
                {profile.username}
              </h2>
              
              <div className="flex items-center gap-2">
                {isOwnProfile ? (
                  <>
                    <button
                      onClick={() => setShowEdit(true)}
                      className="px-4 py-1.5 bg-white border border-[#dbdbdb] text-[#262626] .rounded-[8px] text-sm font-semibold hover:bg-[#efefef] transition"
                    >
                      Edit profile
                    </button>
                    <FaCog className="text-xl cursor-pointer ml-2 text-[#262626]" />
                  </>
                ) : (
                  user && (
                    <button
                      onClick={handleFollow}
                      className={`px-6 py-1.5 .rounded-[8px] text-sm font-semibold transition ${
                        isFollowing
                          ? 'bg-[#efefef] text-[#262626] hover:bg-[#dbdbdb]'
                          : 'bg-[#0095f6] text-white hover:bg-[#1877f2]'
                      }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex gap-10 mb-6 text-[#262626]">
              <span><strong className="font-semibold">{profile.posts?.length || 0}</strong> posts</span>
              <span className="cursor-pointer"><strong className="font-semibold">{profile.followers?.length || 0}</strong> followers</span>
              <span className="cursor-pointer"><strong className="font-semibold">{profile.following?.length || 0}</strong> following</span>
            </div>

            <div className="text-sm">
              <h1 className="font-semibold mb-1 text-[#262626]">{profile.username}</h1>
              <p className="whitespace-pre-wrap text-[#262626]">{profile.bio}</p>
            </div>
          </section>
        </header>

        <div className="flex justify-center border-t border-[#262626] -mt-12 mb-4">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-1.5 py-3 border-t border-[#262626] .-mt-[1px] cursor-pointer">
              <span className="text-xs font-semibold tracking-widest text-[#262626]">POSTS</span>
            </div>
            <div className="flex items-center gap-1.5 py-3 cursor-pointer opacity-40">
              <span className="text-xs font-semibold tracking-widest">SAVED</span>
            </div>
            <div className="flex items-center gap-1.5 py-3 cursor-pointer opacity-40">
              <span className="text-xs font-semibold tracking-widest">TAGGED</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-1 sm:gap-6">
          {profile.posts?.length === 0 ? (
            <div className="col-span-3 flex flex-col items-center py-20 text-[#262626]">
              <div className="rounded-full border-2 border-[#262626] p-4 mb-4">
                 <FaEdit className="text-3xl" />
              </div>
              <h3 className="text-2xl font-bold">No Posts Yet</h3>
            </div>
          ) : (
            profile.posts.map((post) => (
              <div key={post._id} className="relative aspect-square group cursor-pointer overflow-hidden bg-gray-200">
                <img
                  src={post.image}
                  alt="Post"
                  className="absolute top-0 left-0 w-full h-full object-cover group-hover:brightness-75 transition-all duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 text-white font-bold">
                   <span className="flex items-center gap-1">❤️ {post.likes?.length || 0}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showEdit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl max-w-[400px] w-full overflow-hidden shadow-xl">
            <div className="p-4 border-b border-[#dbdbdb] text-center">
               <h2 className="font-semibold">Edit Profile</h2>
            </div>
            <form onSubmit={handleUpdate} className="p-6">
              <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 mb-1 block">Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full p-2 bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] text-sm focus:border-gray-400 outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="text-xs font-bold text-gray-500 mb-1 block">Bio</label>
                <textarea
                  placeholder="Bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full p-2 bg-[#fafafa] border border-[#dbdbdb] rounded-[3px] text-sm focus:border-gray-400 outline-none min-h-[100px] resize-none"
                />
              </div>
              <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 mb-1 block">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePic(e.target.files[0])}
                  className="text-xs w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full py-2 bg-[#0095f6] hover:bg-[#1877f2] text-white .rounded-[8px] text-sm font-bold transition"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="w-full py-2 text-sm text-red-500 font-bold hover:bg-gray-50 .rounded-[8px] transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;