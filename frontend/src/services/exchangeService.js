import api from './api';

export const exchangeService = {
  async proposeExchange(data) {
    const res = await api.post('/exchanges', data);
    return res.data;
  },

  async updateStatus(id, status, notes = null) {
    const res = await api.put(`/exchanges/${id}/status`, { status, notes });
    return res.data;
  },

  async getMyExchanges(status = null) {
    const res = await api.get('/exchanges', { params: status ? { status } : {} });
    return res.data;
  },

  async getExchangeById(id) {
    const res = await api.get(`/exchanges/${id}`);
    return res.data;
  },
};
