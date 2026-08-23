import apiClient from '../api/apiClient';

export const portfolioService = {
  getPortfolio: async () => {
    const response = await apiClient.get('/portfolio');
    return response.data !== undefined ? response.data : response;
  },
  updatePortfolio: async (data) => {
    const response = await apiClient.post('/portfolio', data);
    return response.data !== undefined ? response.data : response;
  },
  uploadCV: async (file) => {
    const formData = new FormData();
    formData.append('cv', file);
    const response = await apiClient.post('/portfolio/upload-cv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data !== undefined ? response.data : response;
  },
  getDashboard: async () => {
    const response = await apiClient.get('/portfolio/dashboard');
    return response.data !== undefined ? response.data : response;
  },
  updateDashboard: async (data) => {
    const response = await apiClient.post('/portfolio/dashboard', data);
    return response.data !== undefined ? response.data : response;
  },
  getAbout: async () => {
    const response = await apiClient.get('/portfolio/about');
    return response.data !== undefined ? response.data : response;
  },
  updateAbout: async (data) => {
    const response = await apiClient.post('/portfolio/about', data);
    return response.data !== undefined ? response.data : response;
  },
  getContact: async () => {
    const response = await apiClient.get('/portfolio/contact');
    return response.data !== undefined ? response.data : response;
  },
  updateContact: async (data) => {
    const response = await apiClient.post('/portfolio/contact', data);
    return response.data !== undefined ? response.data : response;
  }
};

export default portfolioService;
