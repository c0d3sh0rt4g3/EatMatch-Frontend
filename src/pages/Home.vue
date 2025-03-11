<script>
export default {
  name: "Home",
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
  <div class="home-container">
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

    <nav class="bottom-nav">
      <div class="nav-item active">
        <span class="nav-icon">🏠</span>
        <span class="nav-text">Home</span>
      </div>
      <div class="nav-item">
        <span class="nav-icon">🔍</span>
        <span class="nav-text">Explore</span>
      </div>
      <div class="nav-item">
        <span class="nav-icon">⭐</span>
        <span class="nav-text">Reviews</span>
      </div>
      <div class="nav-item">
        <span class="nav-icon">👤</span>
        <span class="nav-text">Profile</span>
      </div>
    </nav>
  </div>
</template>

<style scoped>
/* Base Styles */
.home-container {
  font-family: 'Poppins', sans-serif;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
}

h1, h2, h3 {
  margin: 0;
  font-weight: 600;
}

/* Header Styles */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px;
  background-color: var(--color-bg-primary);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo h1 {
  font-size: 24px;
  color: var(--color-primary);
  margin: 0;
}

.search-bar {
  display: flex;
  flex: 1;
  max-width: 500px;
  margin: 0 20px;
}

.search-bar input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--color-border-light);
  border-radius: 24px 0 0 24px;
  font-size: 14px;
  outline: none;
}

.search-button {
  padding: 12px 20px;
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 0 24px 24px 0;
  cursor: pointer;
  font-weight: 500;
}

.user-profile .avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-border-light);
  cursor: pointer;
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

/* Bottom Navigation */
.bottom-nav {
  display: flex;
  justify-content: space-around;
  background-color: var(--color-bg-primary);
  padding: 12px 0;
  position: fixed;
  bottom: 0;
  width: 100%;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;
  width: 25%;
}

.nav-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.nav-text {
  font-size: 12px;
  font-weight: 500;
}

.nav-item.active {
  color: var(--color-primary);
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
