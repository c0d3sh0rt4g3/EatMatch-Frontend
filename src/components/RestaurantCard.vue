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
    <button class="review-button">Write Review</button>
  </div>
</template>

<script>
export default {
  name: 'RestaurantCard',
  props: {
    restaurant: {
      type: Object,
      required: true
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
