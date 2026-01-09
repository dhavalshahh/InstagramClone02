import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createPost,
  getAllPosts,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment
} from '../../services/api';

export const fetchAllPosts = createAsyncThunk(
  'post/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await getAllPosts();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
  }
);

export const addPost = createAsyncThunk(
  'post/create',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await createPost(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

export const removePost = createAsyncThunk(
  'post/delete',
  async (postId, { rejectWithValue }) => {
    try {
      await deletePost(postId);
      return postId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post');
    }
  }
);

export const toggleLike = createAsyncThunk(
  'post/toggleLike',
  async ({ postId, isLiked }, { rejectWithValue }) => {
    try {
      if (isLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }
      return { postId, isLiked };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle like');
    }
  }
);

export const createComment = createAsyncThunk(
  'post/addComment',
  async ({ postId, text }, { rejectWithValue }) => {
    try {
      const { data } = await addComment(postId, { text });
      return { postId, comment: data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

export const removeComment = createAsyncThunk(
  'post/deleteComment',
  async ({ postId, commentId }, { rejectWithValue }) => {
    try {
      await deleteComment(commentId);
      return { postId, commentId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
    }
  }
);

const postSlice = createSlice({
  name: 'post',
  initialState: {
    posts: [],
    loading: false,
    error: null
  },
  reducers: {
    clearPostError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all posts
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add post
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      // Remove post
      .addCase(removePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(post => post._id !== action.payload);
      })
      // Toggle like
      .addCase(toggleLike.fulfilled, (state, action) => {
        const post = state.posts.find(p => p._id === action.payload.postId);
        if (post) {
          const userId = JSON.parse(localStorage.getItem('persist:root'))?.auth;
          const authData = userId ? JSON.parse(userId) : null;
          const currentUserId = authData?.user?._id;
          
          if (action.payload.isLiked) {
            post.likes = post.likes.filter(id => id !== currentUserId);
          } else {
            post.likes.push(currentUserId);
          }
        }
      })
      .addCase(createComment.fulfilled, (state, action) => {
        const post = state.posts.find(p => p._id === action.payload.postId);
        if (post) {
          post.comments.push(action.payload.comment);
        }
      })
      .addCase(removeComment.fulfilled, (state, action) => {
        const post = state.posts.find(p => p._id === action.payload.postId);
        if (post) {
          post.comments = post.comments.filter(c => c._id !== action.payload.commentId);
        }
      });
  }
});

export const { clearPostError } = postSlice.actions;
export default postSlice.reducer;
