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
    try {
      // 1. Try uploading CV to Firebase Cloud Storage for fast, permanent CDN URL
      const { storage } = await import('../config/firebase');
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storageRef = ref(storage, `cv/${Date.now()}_${cleanFileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      if (downloadURL) {
        return { cvUrl: downloadURL };
      }
    } catch (firebaseErr) {
      console.warn('Firebase storage CV upload failed, falling back to server:', firebaseErr);
    }

    // 2. Fallback to Server API upload if Firebase storage fails
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
  getProjects: async () => {
    const response = await apiClient.get('/portfolio/projects');
    return response.data !== undefined ? response.data : response;
  },
  updateProjects: async (data) => {
    const response = await apiClient.post('/portfolio/projects', data);
    return response.data !== undefined ? response.data : response;
  },
  uploadProjectImage: async (file) => {
    try {
      // 1. Try uploading to Firebase Cloud Storage for permanent CDN URL
      const { storage } = await import('../config/firebase');
      const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
      
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const storageRef = ref(storage, `projects/${Date.now()}_${cleanFileName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      if (downloadURL) {
        return { imageUrl: downloadURL };
      }
    } catch (firebaseErr) {
      console.warn('Firebase storage upload failed or not configured, falling back to server upload:', firebaseErr);
    }

    // 2. Fallback to Server API upload if Firebase storage fails
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post('/portfolio/upload-project-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
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
