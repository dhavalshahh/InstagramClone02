import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMessages, createChat } from '../../services/api';

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await getMessages(userId);
      return data.messages;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const initChat = createAsyncThunk(
  'chat/initChat',
  async (receiverId, { rejectWithValue }) => {
    try {
      const { data } = await createChat({ receiverId });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create chat');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    currentChat: null,
    onlineUsers: [],
    loading: false,
    error: null
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    addOnlineUser: (state, action) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },
    removeOnlineUser: (state, action) => {
      state.onlineUsers = state.onlineUsers.filter(id => id !== action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(initChat.fulfilled, (state, action) => {
        state.currentChat = action.payload;
      });
  }
});

export const {
  addMessage,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  clearMessages
} = chatSlice.actions;

export default chatSlice.reducer;