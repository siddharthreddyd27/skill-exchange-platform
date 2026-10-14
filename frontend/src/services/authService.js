import api from './api';

export const authService = {
  async register(data) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  async login(usernameOrEmail, password) {
    const res = await api.post('/auth/login', { usernameOrEmail, password });
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore network errors on logout
    }
  },
};
