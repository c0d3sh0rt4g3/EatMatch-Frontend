<template>
  <div class="restaurant-search">
    <h1 class="page-title">Find Restaurants</h1>

    <div class="search-container">
      <input
        v-model="searchQuery"
        @keyup.enter="searchRestaurants"
        @input="handleSearchInput"
        type="text"
        placeholder="Search for restaurants..."
        class="search-input"
      />
      <button @click="searchRestaurants" class="search-button">Search</button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Searching for restaurants...</p>
    </div>

    <div v-if="error" class="error-state">
      <p>{{ error }}</p>
    </div>

    <div v-if="restaurants.length" class="results">
      <RestaurantCard
        v-for="restaurant in restaurants"
        :key="restaurant.place_id"
        :restaurant="restaurant"
      />
    </div>

    <div v-else-if="!loading && searchPerformed" class="empty-state">
      <p>No restaurants found matching "{{ searchQuery }}"</p>
      <p>Try a different search term or check your spelling.</p>
    </div>
  </div>
</template>

<script>
import RestaurantCard from "@/components/RestaurantCard.vue";

export default {
  name: 'RestaurantSearch',
  components: {
    RestaurantCard
  },
  data() {
    return {
      apiKey: 'd9fb600e734c4d20afecf495f842b821',
      searchQuery: '',
      restaurants: [],
      loading: false,
      error: null,
      searchPerformed: false
    }
  },
  watch: {
    searchQuery(newValue) {
      if (!newValue || newValue.trim() === '') {
        this.clearResults();
      }
    }
  },
  methods: {
    handleSearchInput() {
      // Clear results when input changes
      if (this.searchPerformed) {
        this.clearResults();
      }
    },

    clearResults() {
      this.restaurants = [];
      this.searchPerformed = false;
      this.error = null;
    },

    async searchRestaurants() {
      if (!this.searchQuery.trim()) {
        this.error = 'Please enter a search term';
        return;
      }

      this.loading = true;
      this.error = null;
      this.searchPerformed = true;

      try {
        // Get user's current position for bias parameter
        const position = await this.getUserPosition();

        // Build the API URL with the correct protocol
        const url = new URL('https://api.geoapify.com/v2/places');
        url.searchParams.append('categories', 'catering.restaurant');
        url.searchParams.append('name', this.searchQuery);

        // Add bias to current location if available - CORRECTED FORMAT
        if (position) {
          url.searchParams.append('bias', `proximity:${position.lon},${position.lat}`);
        }

        url.searchParams.append('limit', '20');
        url.searchParams.append('apiKey', this.apiKey);

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (data.features) {
          this.restaurants = data.features.map(feature => feature.properties);
        } else {
          this.restaurants = [];
        }
      } catch (err) {
        this.error = 'Error searching for restaurants: ' + err.message;
        this.restaurants = [];
      } finally {
        this.loading = false;
      }
    },

    getUserPosition() {
      return new Promise((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lon: position.coords.longitude
              });
            },
            (error) => {
              console.warn('Geolocation error:', error.message);
              // If geolocation fails, resolve with null
              resolve(null);
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            }
          );
        } else {
          console.warn('Geolocation is not supported by this browser');
          resolve(null);
        }
      });
    }
  }
}
</script>

<style scoped>
.restaurant-search {
  margin: 0 auto;
  padding: 40px 20px 80px;
  background-color: var(--color-bg-primary);
  min-height: calc(100vh - 80px);
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 24px;
  text-align: center;
}

.search-container {
  display: flex;
  margin: 0 auto 32px;
  max-width: 800px;
}

.search-input {
  flex: 1;
  padding: 14px 20px;
  font-size: 16px;
  border: 1px solid var(--color-border-light);
  border-radius: 24px 0 0 24px;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: var(--color-primary);
}

.search-button {
  padding: 14px 24px;
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 0 24px 24px 0;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: var(--color-primary-dark);
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 40px;
  background-color: var(--color-bg-secondary);
  border-radius: 16px;
  margin: 32px 0;
}

.loading-state {
  color: var(--color-text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border-light);
  border-top: 4px solid var(--color-primary);
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  color: var(--color-error);
}

.empty-state {
  color: var(--color-text-secondary);
}

.results {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .results {
    grid-template-columns: 1fr;
  }

  .search-container {
    flex-direction: column;
  }

  .search-input {
    border-radius: 24px;
    margin-bottom: 12px;
  }

  .search-button {
    border-radius: 24px;
  }
}
</style>
