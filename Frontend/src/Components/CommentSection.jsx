import { useDispatch, useSelector } from 'react-redux';
import { removeComment } from '../features/post/postSlice';
import { FaTrash, FaRegHeart } from 'react-icons/fa'; 

const CommentSection = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleDeleteComment = (commentId) => {
    dispatch(removeComment({ postId: post._id, commentId }));
  };

  return (
    <div className="flex flex-col gap-3 py-2">
      {post.comments.map((comment) => (
        <div
          key={comment._id}
          className="flex items-start justify-between group"
        >
          <div className="flex gap-3 flex-1">
            <img 
              src={comment.author.profilePicture || 'https://via.placeholder.com/150'} 
              className="w-8 h-8 rounded-full object-cover .flex-shrink-0" 
              alt={comment.author.username} 
            />
            
            <div className="text-sm leading-4">
              <span className="font-bold mr-2 text-[#262626] cursor-pointer hover:text-[#8e8e8e]">
                {comment.author.username}
              </span>
              <span className="text-[#262626]">{comment.text}</span>

              <div className="flex items-center gap-3 mt-2 text-xs text-[#8e8e8e] font-semibold">
                <span>1d</span> 
                <button className="hover:text-gray-400">Reply</button>
                
                {user && comment.author._id === user._id && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 font-normal"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
          <button className="text-[12px] text-[#262626] pt-1 px-2 opacity-60 hover:opacity-100 transition">
            <FaRegHeart />
          </button>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;