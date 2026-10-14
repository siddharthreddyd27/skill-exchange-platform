import api from './api';

export const dashboardService = {
  async getDashboardStats() {
    const res = await api.get('/dashboard');
    return res.data;
  },

  async getMatches() {
    const res = await api.get('/dashboard/matches');
    return res.data;
  },
};
