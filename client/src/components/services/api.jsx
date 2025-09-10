import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const registerHospital = async (hospitalData) => {
  try {
    const response = await api.post('/hospitals/register', hospitalData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

export const loginHospital = async (loginData) => {
  try {
    const response = await api.post('/hospitals/login', loginData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Login failed';
  }
};

export default api;