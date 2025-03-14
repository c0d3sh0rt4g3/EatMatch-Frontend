/**
 * Authentication store module
 * @module stores/auth
 */

import { defineStore } from 'pinia';
import axios from 'axios';

/**
 * Auth store for managing user authentication state
 * @typedef {Object} AuthState
 * @property {Object|null} userData - The authenticated user's data
 * @property {boolean} logged - Whether the user is currently logged in
 * @property {Object} errors - Authentication error messages
 */

/**
 * Define and export the authentication store
 *
 * @returns {Store<'auth', AuthState>} The auth store instance
 */
export const useAuthStore = defineStore('auth', {
  /**
   * State of the auth store
   * @returns {AuthState} Initial state object
   */
  state: () => ({
    /** @type {Object|null} User profile data when authenticated */
    userData: null,
    /** @type {boolean} Authentication status flag */
    logged: false,
    /** @type {Object} Error messages from auth operations */
    errors: {}
  }),

  getters: {
    /**
     * Check if user is authenticated
     * @param {AuthState} state - Store state
     * @returns {boolean} True if user is logged in
     */
    isAuthenticated: (state) => state.logged,

    /**
     * Get current user data
     * @param {AuthState} state - Store state
     * @returns {Object|null} User data or null if not authenticated
     */
    getUser: (state) => state.user,

    /**
     * Get authentication errors
     * @param {AuthState} state - Store state
     * @returns {Object} Error messages object
     */
    getErrors: (state) => state.errors
  },

  actions: {
    /**
     * Authenticate user with credentials
     *
     * @param {Object} credentials - User login credentials
     * @param {string} credentials.email - User email
     * @param {string} credentials.password - User password
     * @returns {Promise<[Error|null, Object|null]>} Tuple with error and response
     */
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

    /**
     * Register a new user account
     *
     * @param {Object} userData - New user registration data
     * @returns {Promise<[Error|null, Object|null]>} Tuple with error and response
     */
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

    /**
     * Logs out the current user and clears authentication state
     */
    logout() {
      this.userData = null;
      this.logged = false;
      this.errors = {};
      localStorage.removeItem('userData');
    },

    /**
     * Clears all authentication errors
     */
    clearErrors() {
      this.errors = {};
    },

    /**
     * Checks localStorage for saved user data and restores session if found
     * Called on application initialization to restore user session
     */
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
