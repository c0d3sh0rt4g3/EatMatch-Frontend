import { defineStore } from 'pinia'

export const useRestaurantStore = defineStore('restaurant', {
  state: () => ({
    currentRestaurant: null
  }),
  
  getters: {
    // Get the current restaurant for review
    getRestaurant: (state) => state.currentRestaurant
  },
  
  actions: {
    // Set the restaurant to be reviewed
    setCurrentRestaurant(restaurant) {
      this.currentRestaurant = restaurant
    },
    
    // Clear the current restaurant
    clearCurrentRestaurant() {
      this.currentRestaurant = null
    }
  }
})
