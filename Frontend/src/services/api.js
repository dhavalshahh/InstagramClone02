import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

// User APIs
export const getUserProfile = (userId) => API.get(`/users/${userId}`);
export const updateProfile = (formData) => API.put('/users/update', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const followUser = (userId) => API.post(`/users/follow/${userId}`);
export const unfollowUser = (userId) => API.post(`/users/unfollow/${userId}`);

// Post APIs
export const createPost = (formData) => API.post('/posts', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getAllPosts = () => API.get('/posts');
export const deletePost = (postId) => API.delete(`/posts/${postId}`);
export const likePost = (postId) => API.put(`/posts/like/${postId}`);
export const unlikePost = (postId) => API.put(`/posts/unlike/${postId}`);

// Comment APIs
export const addComment = (postId, data) => API.post(`/comments/${postId}`, data);
export const deleteComment = (commentId) => API.delete(`/comments/${commentId}`);

// Chat APIs
export const createChat = (data) => API.post('/chat', data);
export const getMessages = (userId) => API.get(`/chat/${userId}`);

export default API;
