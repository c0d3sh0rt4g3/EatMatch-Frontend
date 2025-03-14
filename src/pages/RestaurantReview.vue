<template>
  <div class="write-review-container">
    <h1 class="page-title">Write a Review</h1>

    <div class="restaurant-info" v-if="restaurant">
      <h2>{{ restaurant.name }}</h2>
      <div class="address">
        <p v-if="restaurant.address_line1">{{ restaurant.address_line1 }}</p>
        <p v-if="restaurant.address_line2">{{ restaurant.address_line2 }}</p>
        <p v-if="restaurant.city">{{ restaurant.city }}, {{ restaurant.country }}</p>
      </div>
    </div>

    <div v-else class="error-message">
      <p>Restaurant not found. Please select a restaurant to review.</p>
      <router-link to="/search" class="login-link">Find Restaurant</router-link>
    </div>

    <div v-if="!authStore.logged" class="login-message">
      <p>Please log in to write a review</p>
      <button class="auth-button login-button" @click="showLogin = true">Log In</button>
      <Login v-if="showLogin" @close="showLogin = false" />
    </div>

    <form v-else-if="restaurant" @submit.prevent="submitReview" class="review-form">
      <div class="form-group">
        <label for="rating">Rating</label>
        <div class="star-rating">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ 'selected': star <= review.rating }"
            @click="review.rating = star"
          >
            ★
          </span>
        </div>
      </div>

      <div class="form-group">
        <label for="title">Title</label>
        <input
          type="text"
          id="title"
          v-model="review.title"
          placeholder="Summarize your experience"
          required
        >
      </div>

      <div class="form-group">
        <label for="body">Review</label>
        <textarea
          id="body"
          v-model="review.body"
          placeholder="Tell us about your experience"
          rows="5"
          required
        ></textarea>
      </div>

      <div v-if="submitError" class="error-message">
        {{ submitError }}
      </div>

      <div class="form-actions">
        <button type="button" class="cancel-button" @click="goBack">Cancel</button>
        <button type="submit" class="submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit Review' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import {useAuthStore} from "@/stores/authStore.js";
import {useRestaurantStore} from "@/stores/restaurantStore.js";
import axios from "axios";
import Login from "@/components/Login.vue";

/**
 * Restaurant Review Page
 *
 * Allows users to submit reviews for restaurants. It displays restaurant information,
 * handles authentication checks, and provides a form for submitting ratings and reviews.
 */
export default {
  name: 'RestaurantReviewForm',
  components: {Login},

  /**
   * Component data properties
   * @returns {Object} Component data properties
   */
  data() {
    return {
      /** @type {boolean} Controls visibility of the login dialog */
      showLogin: false,

      /**
       * Review object containing the review data to be submitted
       * @type {Object}
       * @property {string|null} restaurant_id - ID of the restaurant being reviewed
       * @property {number|null} reviewer_id - ID of the user submitting the review
       * @property {string|number} rating - Star rating given to the restaurant (1-5)
       * @property {string} title - Title of the review
       * @property {string} body - Content of the review
       */
      review: {
        restaurant_id: null,
        reviewer_id: null,
        rating: '',
        title: '',
        body: ''
      },

      /** @type {boolean} Indicates if a review submission is in progress */
      isSubmitting: false,

      /** @type {string|null} Stores error messages during review submission */
      submitError: null,

      /** @type {boolean} Indicates if the review was successfully submitted */
      submitSuccess: false
    };
  },

  /**
   * Computed properties
   */
  computed: {
    /**
     * Returns the authentication store
     * @returns {Object} Authentication store
     */
    authStore() {
      return useAuthStore();
    },

    /**
     * Returns the restaurant store
     * @returns {Object} Restaurant store
     */
    restaurantStore() {
      return useRestaurantStore();
    },

    /**
     * Returns the current restaurant from the store
     * @returns {Object|null} Current restaurant object
     */
    restaurant() {
      return this.restaurantStore.currentRestaurant;
    }
  },

  /**
   * Lifecycle hook that runs when the component is created
   * Sets up restaurant ID and reviewer ID
   */
  created() {
    // Check if restaurant exists in store
    if (this.restaurant) {
      // Use restaurant from store
      this.review.restaurant_id = this.restaurant.place_id;
    } else {
      // Fallback: try to get ID from URL
      this.getRestaurantIdFromUrl();
    }

    // Set reviewer_id from auth store
    if (this.authStore.userData && this.authStore.userData.user) {
      this.review.reviewer_id = this.authStore.userData.user.id;
    }
  },

  methods: {
    /**
     * Extracts restaurant ID from the route parameters
     */
    getRestaurantIdFromUrl() {
      const id = this.$route.params.id;
      if (id) {
        this.review.restaurant_id = id;
      }
    },

    /**
     * Creates authentication headers for API requests
     * @returns {Object} Headers object with bearer token if authenticated
     */
    getAuthHeaders() {
      const headers = {};
      if (this.authStore.userData && this.authStore.userData.token) {
        headers['Authorization'] = `Bearer ${this.authStore.userData.token}`;
      }
      return headers;
    },

    /**
     * Creates a restaurant in the database before submitting a review
     * @returns {Promise<Object>} The created restaurant data
     * @throws {Error} If restaurant creation fails
     */
    async postRestaurant() {
      // Verificamos que tengamos datos del restaurante
      if (!this.restaurant) {
        throw new Error('No hay datos disponibles para crear el restaurante.');
      }

      try {
        // Registramos el objeto completo del restaurante
        console.log('Datos completos del restaurante en el store:', this.restaurant);
        // Solo incluimos name e id según lo solicitado
        const restaurantData = {
          id: this.restaurant.place_id,
          name: this.restaurant.name
        };

        console.log('Datos del restaurante que se van a enviar:', restaurantData);
        // Enviamos petición para crear el restaurante
        const response = await axios.post(import.meta.env.VITE_API_URL + '/restaurants', restaurantData, {
          headers: this.getAuthHeaders()
        });

        console.log('Restaurante creado exitosamente en la base de datos:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error al crear el restaurante:', error);
        console.error('Detalles del error:', {
          mensaje: error.message,
          respuesta: error.response?.data,
          código: error.response?.status
        });
        throw new Error('No se pudo crear el restaurante: ' +
          (error.response?.data?.message || error.message));
      }
    },

    /**
     * Submits the review to the API
     * If submission fails due to missing restaurant, attempts to create restaurant first
     * @returns {Promise<void>}
     */
    async submitReview() {
      this.isSubmitting = true;
      this.submitError = null;

      try {
        // Validate restaurant_id exists
        if (!this.review.restaurant_id) {
          throw new Error('Restaurant ID is missing. Please try again.');
        }

        // Validate user is logged in
        if (!this.authStore.logged) {
          throw new Error('You must be logged in to submit a review.');
        }

        // Validate reviewer_id exists
        if (!this.review.reviewer_id) {
          this.review.reviewer_id = this.authStore.userData.user.id;
        }

        try {
          // Intentamos enviar la reseña primero
          await axios.post(import.meta.env.VITE_API_URL + '/reviews', this.review, {
            headers: this.getAuthHeaders()
          });
        } catch (reviewError) {
          console.error('Falló el envío de la reseña, intentando crear el restaurante primero:', reviewError);

          // Si falla la reseña, intentamos crear el restaurante primero
          await this.postRestaurant();

          // Luego volvemos a intentar enviar la reseña
          await axios.post(import.meta.env.VITE_API_URL + '/reviews', this.review, {
            headers: this.getAuthHeaders()
          });
        }

        // Reset form on success
        this.review.rating = '';
        this.review.title = '';
        this.review.body = '';
        this.submitSuccess = true;

        // Redirect to restaurant page
        this.$router.push(`/restaurants`);

        // Clear the current restaurant from store
        this.restaurantStore.clearCurrentRestaurant();

      } catch (error) {
        console.error('Error submitting review:', error);
        this.submitError = error.response?.data?.message ||
                          error.message ||
                          'Failed to submit review. Please try again.';
      } finally {
        this.isSubmitting = false;
      }
    },

    /**
     * Navigates back to previous page or restaurant details
     * Clears current restaurant from store before navigation
     */
    goBack() {
      // Clear current restaurant from store
      this.restaurantStore.clearCurrentRestaurant();

      if (this.review.restaurant_id) {
        this.$router.push(`/restaurants/${this.review.restaurant_id}`);
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>


<style scoped>
.write-review-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.page-title {
  font-size: 28px;
  margin-bottom: 24px;
  color: var(--color-text-primary);
}

.restaurant-info {
  background-color: var(--color-bg-secondary);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

.restaurant-info h2 {
  font-size: 22px;
  margin-top: 0;
  margin-bottom: 12px;
}

.address p {
  margin: 4px 0;
  color: var(--color-text-secondary);
}

.review-form {
  background-color: var(--color-bg-secondary);
  border-radius: 12px;
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--color-text-primary);
}

input, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
}

.star-rating {
  display: flex;
  font-size: 32px;
  cursor: pointer;
}

.star {
  color: #ddd;
  transition: color 0.2s;
  margin-right: 5px;
}

.star:hover, .star.selected {
  color: #ffb400;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-button, .submit-button {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button {
  background-color: transparent;
  border: 1px solid var(--color-text-secondary);
  color: var(--color-text-secondary);
}

.submit-button {
  background-color: var(--color-primary);
  border: none;
  color: var(--color-text-inverse);
}

.submit-button:hover {
  background-color: var(--color-primary-dark);
}

.submit-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #f44336;
  margin-bottom: 16px;
  padding: 8px;
  background-color: rgba(244, 67, 54, 0.1);
  border-radius: 4px;
}

.login-message {
  text-align: center;
  padding: 24px;
  background-color: var(--color-bg-secondary);
  border-radius: 12px;
  margin-bottom: 24px;
}

.login-link {
  display: inline-block;
  margin-top: 12px;
  padding: 8px 16px;
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
}

.login-button {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.login-button:hover {
  background-color: var(--color-primary-100);
}
</style>
