import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const arenas = {
  getAll: (status) => api.get(`/arenas${status ? `?status=${status}` : ''}`),
  getById: (arenaId) => api.get(`/arenas/${arenaId}`),
  create: (arenaData) => api.post('/arenas', arenaData),
  join: (arenaId) => api.post(`/arenas/${arenaId}/join`),
  generateTestCases: (arenaId, description) => api.post(`/arenas/${arenaId}/test-cases`, { description }),
  submitCode: (arenaId, code, language) => api.post(`/arenas/${arenaId}/submit`, { code, language }),
  awardRewards: (arenaId, userId, score, rank) => api.post(`/arenas/${arenaId}/rewards`, { userId, score, rank }),
};

export const users = {
  getProfile: (userId) => api.get(`/users/${userId}`),
};

export const matchmaking = {
  quickMatch: () => api.post('/matchmaking/quick-match'),
};

export const leaderboard = {
  getTop10: () => api.get('/leaderboard'),
};

export default api;