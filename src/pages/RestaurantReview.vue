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
      <router-link to="/login" class="login-link">Log In</router-link>
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

export default {
  name: 'RestaurantReviewForm',

  data() {
    return {
      review: {
        restaurant_id: null,
        reviewer_id: null,
        rating: '',
        title: '',
        body: ''
      },
      isSubmitting: false,
      submitError: null,
      submitSuccess: false
    };
  },

  computed: {
    authStore() {
      return useAuthStore();
    },
    restaurantStore() {
      return useRestaurantStore();
    },
    restaurant() {
      return this.restaurantStore.currentRestaurant;
    }
  },

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
    getRestaurantIdFromUrl() {
      const id = this.$route.params.id;
      if (id) {
        this.review.restaurant_id = id;
      }
    },

    getAuthHeaders() {
      const headers = {};
      if (this.authStore.userData && this.authStore.userData.token) {
        headers['Authorization'] = `Bearer ${this.authStore.userData.token}`;
      }
      return headers;
    },

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
        const response = await axios.post('http://localhost:8000/api/restaurants', restaurantData, {
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
          await axios.post('http://localhost:8000/api/reviews', this.review, {
            headers: this.getAuthHeaders()
          });
        } catch (reviewError) {
          console.error('Falló el envío de la reseña, intentando crear el restaurante primero:', reviewError);

          // Si falla la reseña, intentamos crear el restaurante primero
          await this.postRestaurant();

          // Luego volvemos a intentar enviar la reseña
          await axios.post('http://localhost:8000/api/reviews', this.review, {
            headers: this.getAuthHeaders()
          });
        }

        // Reset form on success
        this.review.rating = '';
        this.review.title = '';
        this.review.body = '';
        this.submitSuccess = true;

        // Redirect to restaurant page
        this.$router.push(`/restaurants/${this.review.restaurant_id}`);

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
</style>
