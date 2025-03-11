<script>
import Footer from "@/components/Footer.vue";

export default {
  name: "Home",
  components: {Footer},
  data() {
    return {
      featuredRestaurants: [
        { id: 1, name: "Bistro Moderne", rating: 4.7, cuisine: "French", image: "/images/restaurant1.jpg" },
        { id: 2, name: "Spice Garden", rating: 4.5, cuisine: "Indian", image: "/images/restaurant2.jpg" },
        { id: 3, name: "Ocean Blue", rating: 4.8, cuisine: "Seafood", image: "/images/restaurant3.jpg" }
      ],
      categories: [
        { id: 1, name: "Italian", icon: "pasta" },
        { id: 2, name: "Japanese", icon: "sushi" },
        { id: 3, name: "Mexican", icon: "taco" },
        { id: 4, name: "Vegetarian", icon: "salad" }
      ]
    }
  }
}
</script>

<template>
  <section class="categories-section">
    <h2>Categories</h2>
    <div class="categories-container">
      <div v-for="category in categories" :key="category.id" class="category-card">
        <div class="category-icon">{{ category.icon }}</div>
        <p>{{ category.name }}</p>
      </div>
    </div>
  </section>

  <section class="featured-section">
    <h2>Featured Restaurants</h2>
    <div class="restaurant-cards">
      <div v-for="restaurant in featuredRestaurants" :key="restaurant.id" class="restaurant-card">
        <div class="restaurant-image" :style="{ backgroundImage: `url(${restaurant.image})` }"></div>
        <div class="restaurant-info">
          <h3>{{ restaurant.name }}</h3>
          <div class="restaurant-details">
            <span class="rating">★ {{ restaurant.rating }}</span>
            <span class="cuisine">{{ restaurant.cuisine }}</span>
          </div>
          <button class="review-button">Write Review</button>
        </div>
      </div>
    </div>
  </section>

  <section class="recent-reviews">
    <h2>Recent Reviews</h2>
    <div class="reviews-container">
      <!-- Recent reviews would go here -->
    </div>
  </section>
</template>

<style scoped>

h1, h2, h3 {
  margin: 0;
  font-weight: 600;
}

/* Categories Section */
.categories-section {
  padding: 24px 16px;
}

.categories-section h2 {
  margin-bottom: 16px;
  font-size: 20px;
}

.categories-container {
  display: flex;
  overflow-x: auto;
  gap: 16px;
  padding-bottom: 8px;
}

.category-card {
  min-width: 80px;
  text-align: center;
  padding: 12px;
  background-color: var(--color-bg-primary);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.category-card:hover {
  transform: translateY(-5px);
}

.category-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.category-card p {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
}

/* Featured Restaurants Section */
.featured-section {
  padding: 24px 16px;
}

.featured-section h2 {
  margin-bottom: 16px;
  font-size: 20px;
}

.restaurant-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.restaurant-card {
  background-color: var(--color-bg-primary);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.restaurant-card:hover {
  transform: translateY(-8px);
}

.restaurant-image {
  height: 180px;
  background-size: cover;
  background-position: center;
}

.restaurant-info {
  padding: 16px;
}

.restaurant-info h3 {
  margin-bottom: 8px;
  font-size: 18px;
}

.restaurant-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 14px;
}

.rating {
  color: var(--color-warning);
  font-weight: 600;
}

.cuisine {
  color: var(--color-text-secondary);
}

.review-button {
  width: 100%;
  padding: 10px;
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.review-button:hover {
  background-color: var(--color-primary-dark);
}

/* Recent Reviews Section */
.recent-reviews {
  padding: 24px 16px;
}

.recent-reviews h2 {
  margin-bottom: 16px;
  font-size: 20px;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .restaurant-cards {
    grid-template-columns: 1fr;
  }

  .search-bar {
    max-width: 60%;
  }
}
</style>
