import api from './api';

export const connectionService = {
  async sendRequest(receiverId, message = '') {
    const res = await api.post('/connections/request', { receiverId, message });
    return res.data;
  },

  async respondToRequest(id, status) {
    const res = await api.put(`/connections/request/${id}/respond`, null, {
      params: { status }
    });
    return res.data;
  },

  async getIncomingRequests() {
    const res = await api.get('/connections/incoming');
    return res.data;
  },

  async getOutgoingRequests() {
    const res = await api.get('/connections/outgoing');
    return res.data;
  },

  async getConnectedPeers() {
    const res = await api.get('/connections/peers');
    return res.data;
  },
};
