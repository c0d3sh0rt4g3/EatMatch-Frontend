/**
 * Restaurant store module for managing restaurant data
 * @module stores/restaurant
 */

import { defineStore } from 'pinia';

/**
 * Store for managing restaurant-related state
 * @typedef {Object} RestaurantState
 * @property {Object|null} currentRestaurant - Currently selected restaurant
 */

/**
 * Define and export the restaurant store
 *
 * @returns {import('pinia').Store<'restaurant', RestaurantState>} The restaurant store instance
 */
export const useRestaurantStore = defineStore('restaurant', {
  /**
   * State of the restaurant store
   * @returns {RestaurantState} Initial state object
   */
  state: () => ({
    /**
     * Currently selected restaurant data
     * @type {Object|null}
     */
    currentRestaurant: null
  }),

  getters: {
    /**
     * Get the current restaurant for review
     * @param {RestaurantState} state - Store state
     * @returns {Object|null} Current restaurant data or null if none selected
     */
    getRestaurant: (state) => state.currentRestaurant
  },

  actions: {
    /**
     * Set the restaurant to be reviewed
     * @param {Object} restaurant - Restaurant data object
     */
    setCurrentRestaurant(restaurant) {
      this.currentRestaurant = restaurant;
    },

    /**
     * Clear the current restaurant selection
     */
    clearCurrentRestaurant() {
      this.currentRestaurant = null;
    }
  }
});
