import apiClient from '../api/apiClient';

export const portfolioService = {
  getPortfolio: async () => {
    const response = await apiClient.get('/api/portfolio');
    // Supports both standard { data: ... } and direct JSON payload formats
    return response.data !== undefined ? response.data : response;
  },
};

export default portfolioService;
