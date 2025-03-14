<template>
  <div class="restaurant-card">
    <h2 class="restaurant-name">{{ restaurant.name }}</h2>
    <div class="restaurant-details">
      <div class="restaurant-address">
        <p v-if="restaurant.address_line1">{{ restaurant.address_line1 }}</p>
        <p v-if="restaurant.address_line2">{{ restaurant.address_line2 }}</p>
        <p v-if="restaurant.city">{{ restaurant.city }}, {{ restaurant.country }}</p>
      </div>
    </div>
    <router-link :to="`/restaurants/${restaurant.place_id}/write-review`">
      <button @click="setForReview" class="review-button">Write Review</button>
    </router-link>
  </div>
</template>

<script>
import { useRestaurantStore } from '@/stores/restaurantStore'

/**
 * Restaurant Card Component
 *
 * Displays restaurant information in a card format with name and address details.
 * Provides a button to navigate to the review page for the selected restaurant.
 */
export default {
  name: 'RestaurantCard',
  props: {
    /**
     * Restaurant object containing details to be displayed
     * @type {Object}
     * @property {string} name - The name of the restaurant
     * @property {string} [address_line1] - First line of the restaurant's address
     * @property {string} [address_line2] - Second line of the restaurant's address (optional)
     * @property {string} [city] - City where the restaurant is located
     * @property {string} [country] - Country where the restaurant is located
     * @property {string} place_id - Unique identifier for the restaurant used for routing
     * @required
     */
    restaurant: {
      type: Object,
      required: true
    }
  },
  methods: {
    /**
     * Stores the current restaurant in the global restaurant store
     * Called when the user clicks the "Write Review" button
     * This ensures the restaurant data is available on the review page
     */
    setForReview() {
      // Store the selected restaurant in the global store
      const restaurantStore = useRestaurantStore()
      restaurantStore.setCurrentRestaurant(this.restaurant)
    }
  }
}
</script>

<style scoped>
.restaurant-card {
  background-color: var(--color-bg-secondary);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.restaurant-card:hover {
  transform: translateY(-5px);
}

.restaurant-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-top: 0;
  margin-bottom: 16px;
}

.restaurant-details {
  margin-bottom: 20px;
}

.restaurant-address p {
  margin: 4px 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.review-button {
  width: 100%;
  padding: 12px;
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 15px;
}

.review-button:hover {
  background-color: var(--color-primary-dark);
}
</style>
