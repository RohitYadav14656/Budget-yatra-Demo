import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
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
