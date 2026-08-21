import apiClient from '../api/apiClient';

export const contactService = {
  sendMessage: async ({ name, email, message }) => {
    const response = await apiClient.post('/api/contact', {
      name,
      email,
      message,
    });
    return response;
  },
};

export default contactService;
