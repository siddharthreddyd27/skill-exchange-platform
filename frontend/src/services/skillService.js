import api from './api';

export const skillService = {
  async getAllSkills() {
    const res = await api.get('/skills');
    return res.data;
  },

  async searchSkills(q = '') {
    const res = await api.get('/skills/search', { params: { q } });
    return res.data;
  },

  async getCategories() {
    const res = await api.get('/skills/categories');
    return res.data;
  },

  async createSkill(data) {
    const res = await api.post('/skills', data);
    return res.data;
  },

  async getMySkills(type = null) {
    const res = await api.get('/user-skills/my', { params: type ? { type } : {} });
    return res.data;
  },

  async getUserSkills(userId, type = null) {
    const res = await api.get(`/user-skills/user/${userId}`, { params: type ? { type } : {} });
    return res.data;
  },

  async addMySkill(data) {
    const res = await api.post('/user-skills', data);
    return res.data;
  },

  async updateMySkill(id, data) {
    const res = await api.put(`/user-skills/${id}`, data);
    return res.data;
  },

  async deleteMySkill(id) {
    const res = await api.delete(`/user-skills/${id}`);
    return res.data;
  },
};
