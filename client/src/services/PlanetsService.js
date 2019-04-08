import api from './api';

export default {
  async fetchCoordinates(ms, ratio) {
    const config = {
      params: {
        ms,
        ratio,
      },
    };
    const response = await api().get('planets', config);
    if (response.status === 200) {
      return response.data;
    }
    return [];
  },
  async fetchDayInfo(ms) {
    const config = {
      params: {
        ms,
      },
    };
    const response = await api().get('planets/aspects', config);
    if (response.status === 200) {
      return response.data;
    }
    return [];
  },
};
