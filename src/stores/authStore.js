import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userData: null,
    logged: false,
    errors: {}
  }),
  getters: {
    isAuthenticated: (state) => state.logged,
    getUser: (state) => state.user,
    getErrors: (state) => state.errors
  },
  actions: {
    async login(credentials) {
      try {
        const response = await axios.post(import.meta.env.VITE_API_URL + '/login', credentials);
        this.userData = response.data;
        this.logged = true;
        localStorage.setItem('userData', JSON.stringify(response.data));
        this.errors = {};
        return [null, response.data];
      } catch (error) {
        if (error.response?.data) {
          this.errors = { message: "Error, Incorrect email or password" };
        } else {
          this.errors = { message: "Login failed. Please try again." };
        }
        return [error, null];
      }
    },

    async register(userData) {
      try {
        const response = await axios.post(import.meta.env.VITE_API_URL + '/register', userData);
        this.userData = response.data;
        this.logged = true;
        localStorage.setItem('userData', JSON.stringify(response.data));
        this.errors = {};
        return [null, response.data];
      } catch (error) {
        if (error.response?.data) {
          this.errors = { message: "Registration failed. Please try again later." };
        } else {
          this.errors = { message: "An error occurred during registration" };
        }
        return [error, null];
      }
    },

    logout() {
      this.userData = null;
      this.logged = false;
      this.errors = {};
      localStorage.removeItem('userData');
    },

    clearErrors() {
      this.errors = {};
    },

    checkLocalStorage() {
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          this.userData = JSON.parse(userData);
          this.logged = true;
        } catch (e) {
          localStorage.removeItem('userData');
        }
      }
    }
  }
});
