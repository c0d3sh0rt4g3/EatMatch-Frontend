<script>
import Footer from "@/components/Footer.vue";
import axios from "axios";

export default {
  name: "Home",
  components: { Footer },
  data() {
    return {
      featuredRestaurants: [],
      recentReviews: [],
      restaurantsLoading: false,
      reviewsLoading: false,
      restaurantError: null,
      reviewError: null
    };
  },
  created() {
    this.fetchRestaurants();
    this.fetchReviews();
  },
  methods: {
    async fetchRestaurants() {
      this.restaurantsLoading = true;
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + '/restaurants');
        const restaurants = response.data;

        // Calculate average rating for each restaurant
        const restaurantsWithRating = restaurants.map(restaurant => {
          const reviews = restaurant.reviews || [];
          const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
          const avgRating = reviews.length > 0 ? (totalRating / reviews.length).toFixed(1) : 0;

          return {
            id: restaurant.id,
            name: restaurant.name,
            rating: parseFloat(avgRating),
            cuisine: "Various", // Placeholder
            image: `/images/restaurant${restaurant.id % 5 + 1}.jpg` // Cycling through available images
          };
        });

        // Sort by rating (highest first) and take top 5
        this.featuredRestaurants = restaurantsWithRating
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 5);

      } catch (error) {
        this.restaurantError = "Failed to fetch restaurants";
        console.error(error);
      } finally {
        this.restaurantsLoading = false;
      }
    },
    async fetchReviews() {
      this.reviewsLoading = true;
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + '/reviews');
        const allReviews = response.data;
        console.log(allReviews)
        // Get 10 random reviews
        const shuffledReviews = this.shuffleArray([...allReviews]);
        this.recentReviews = shuffledReviews.slice(0, 10);
      } catch (error) {
        this.reviewError = "Failed to fetch reviews";
        console.error(error);
      } finally {
        this.reviewsLoading = false;
      }
    },
    shuffleArray(array) {
      // Fisher-Yates shuffle algorithm
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  }
};
</script>


<template>
  <section class="featured-section">
    <h2>Featured Restaurants</h2>
    <div v-if="restaurantsLoading" class="loading">Loading restaurants...</div>
    <div v-else-if="restaurantError" class="error">{{ restaurantError }}</div>
    <div v-else class="restaurant-cards">
      <div v-for="restaurant in featuredRestaurants" :key="restaurant.id" class="restaurant-card">
        <div class="restaurant-image" :style="{ backgroundImage: `url(${restaurant.image})` }"></div>
        <div class="restaurant-info">
          <h3>{{ restaurant.name }}</h3>
          <div class="restaurant-details">
            <span class="rating">★ {{ restaurant.rating }}</span>
            <span class="cuisine">{{ restaurant.cuisine }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="recent-reviews">
    <h2>Recent Reviews</h2>
    <div v-if="reviewsLoading" class="loading">Loading reviews...</div>
    <div v-else-if="reviewError" class="error">{{ reviewError }}</div>
    <div v-else class="reviews-container">
      <div v-for="review in recentReviews" :key="review.id" class="review-card">
        <div class="review-header">
          <div class="reviewer-info">
            <h3>{{ review.restaurant.name || 'Restaurant' }}</h3>
            <span class="review-date">{{ formatDate(review.updated_at) }}</span>
          </div>
          <div class="review-rating">★ {{ review.rating }}</div>
        </div>
        <p class="review-text">{{ review.comment }}</p>
      </div>
    </div>
  </section>
</template>


<style scoped>

h1, h2, h3 {
  margin: 0;
  font-weight: 600;
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

.recent-reviews {
  padding: 24px 16px;
}

.recent-reviews h2 {
  margin-bottom: 16px;
  font-size: 20px;
}

.reviews-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.review-card {
  background-color: var(--color-bg-primary);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.review-card:hover {
  transform: translateY(-4px);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.reviewer-info h3 {
  font-size: 16px;
  margin-bottom: 4px;
}

.review-date {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.review-rating {
  color: var(--color-warning);
  font-weight: 600;
  font-size: 16px;
}

.review-text {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
  color: var(--color-text-primary);
}

.reviewer-name {
  font-size: 14px;
  font-style: italic;
  color: var(--color-text-secondary);
  text-align: right;
}

.loading, .error {
  text-align: center;
  padding: 20px;
  font-size: 16px;
}

.error {
  color: var(--color-error);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .reviews-container {
    grid-template-columns: 1fr;
  }
  .restaurant-cards {
    grid-template-columns: 1fr;
  }

  .search-bar {
    max-width: 60%;
  }
}
</style>
