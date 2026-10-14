import api from './api';

export const userService = {
  async getMyProfile() {
    const res = await api.get('/users/me');
    return res.data;
  },

  async updateMyProfile(data) {
    const res = await api.put('/users/me', data);
    return res.data;
  },

  async getUserById(id) {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  async searchUsers(query = '') {
    const res = await api.get('/users/search', { params: { query } });
    return res.data;
  },

  async filterBySkill(skill = '', category = '') {
    const res = await api.get('/users/filter-by-skill', { params: { skill, category } });
    return res.data;
  },
};
