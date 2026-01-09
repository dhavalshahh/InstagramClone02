import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
  getUserProfile, 
  updateProfile, 
  followUser, 
  unfollowUser 
} from '../../services/api';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await getUserProfile(userId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await updateProfile(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const follow = createAsyncThunk(
  'user/follow',
  async (userId, { rejectWithValue }) => {
    try {
      await followUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to follow');
    }
  }
);

export const unfollow = createAsyncThunk(
  'user/unfollow',
  async (userId, { rejectWithValue }) => {
    try {
      await unfollowUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unfollow');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    loading: false,
    error: null
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      // Follow
      .addCase(follow.fulfilled, (state, action) => {
        // Update can be handled by refetching profile
      })
      // Unfollow
      .addCase(unfollow.fulfilled, (state, action) => {
        // Update can be handled by refetching profile
      });
  }
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;