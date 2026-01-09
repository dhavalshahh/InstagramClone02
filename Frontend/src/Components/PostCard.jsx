import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLike, createComment, removePost } from '../features/post/postSlice';
import { FaHeart, FaRegHeart, FaComment, FaTrash } from 'react-icons/fa';
import CommentSection from './CommentSection';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const isLiked = user && post.likes.includes(user._id);
  const isAuthor = user && post.author._id === user._id;

  const handleLike = () => {
    if (!user) {
      alert('Please login to like posts');
      return;
    }
    dispatch(toggleLike({ postId: post._id, isLiked }));
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to comment');
      return;
    }
    if (!comment.trim()) return;

    dispatch(createComment({ postId: post._id, text: comment }));
    setComment('');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      dispatch(removePost(post._id));
    }
  };

  return (
    <div className="bg-white border border-ig-border rounded-lg mb-6 max-w-[614px]">
      <div className="p-3.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src={post.author.profilePicture}
            alt={post.author.username}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="font-semibold text-sm">
            {post.author.username}
          </span>
        </div>
        {isAuthor && (
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-base"
          >
            <FaTrash />
          </button>
        )}
      </div>

      <img
        src={post.image}
        alt="Post"
        className="w-full block"
      />

      <div className="p-2 px-4">
        <div className="flex gap-4 mb-2">
          <button
            onClick={handleLike}
            className={`text-2xl ${isLiked ? 'text-red-500' : 'text-gray-900'} hover:text-ig-gray transition`}
          >
            {isLiked ? <FaHeart /> : <FaRegHeart />}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-2xl text-gray-900 hover:text-ig-gray transition"
          >
            <FaComment />
          </button>
        </div>

        <div className="text-sm font-semibold mb-2">
          {post.likes.length} likes
        </div>

        {post.caption && (
          <div className="text-sm mb-2">
            <span className="font-semibold mr-1">
              {post.author.username}
            </span>
            {post.caption}
          </div>
        )}

        {post.comments.length > 0 && (
          <button
            onClick={() => setShowComments(!showComments)}
            className="text-ig-gray text-sm mb-2"
          >
            View all {post.comments.length} comments
          </button>
        )}

        {showComments && <CommentSection post={post} />}

        {user && (
          <form onSubmit={handleComment} className="border-t border-gray-100 pt-2 mt-2 flex">
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 border-none outline-none text-sm"
            />
            <button
              type="submit"
              disabled={!comment.trim()}
              className={`font-semibold text-sm ${
                comment.trim() ? 'text-ig-blue' : 'text-blue-300'
              } ${comment.trim() ? 'cursor-pointer' : 'cursor-default'}`}
            >
              Post
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PostCard;