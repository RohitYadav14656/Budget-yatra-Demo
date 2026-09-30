import axios from 'axios';

const getBaseUrl = () => {
  const rawUrl = 
    import.meta.env.VITE_API_BASE_URL || 
    import.meta.env.VITE_API_BASE_URI || 
    'https://budget-yatra-demo-server.onrender.com/api';

  let cleanUrl = rawUrl.trim().replace(/\/+$/, '');
  if (!cleanUrl.endsWith('/api')) {
    cleanUrl += '/api';
  }
  return cleanUrl;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
});

export const generateTripApi = async (formData) => {
  const response = await api.post('/trips/generate', formData);
  return response.data;
};

export const fetchAllTripsApi = async () => {
  const response = await api.get('/trips');
  return response.data;
};

export const fetchTripByIdApi = async (id) => {
  const response = await api.get(`/trips/${id}`);
  return response.data;
};
