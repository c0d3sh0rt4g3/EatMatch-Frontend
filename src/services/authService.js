import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export default {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      return [null, response.data];
    } catch (error) {
      console.error('Login error:', error);
      return [error, null];
    }
  },

  async register(userData) {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return [null, response.data];
    } catch (error) {
      console.error('Registration error:', error);
      return [error, null];
    }
  }
};
