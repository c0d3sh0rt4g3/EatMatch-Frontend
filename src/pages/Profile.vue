<template>
  <div class="profile-container">
    <!-- Authentication warning message -->
    <div v-if="!isLoggedIn" class="auth-warning">
      <div class="warning-content">
        <h2>Authentication Required</h2>
        <p>You need to be logged in to access your profile page.</p>
        <div class="warning-actions">
          <router-link to="/" class="primary-button">Ok</router-link>
        </div>
      </div>
    </div>

    <!-- Profile content (only shown when logged in) -->
    <div v-else>
      <div class="profile-header">
        <div class="profile-avatar">
          <div class="avatar-placeholder">{{ getUserInitials() }}</div>
        </div>
        <div class="profile-info">
          <h1 class="profile-name">{{ user?.name || 'User' }} {{ user?.surname || '' }}</h1>
          <p class="profile-email">{{ user?.email || 'No email available' }}</p>
        </div>
      </div>

      <section class="profile-stats" v-if="user">
        <div class="stat-card">
          <span class="number">{{ userReviews.length }}</span>
          <span class="label">Reviews</span>
        </div>
        <div class="stat-card">
          <span class="number">{{ getAverageRating() }}</span>
          <span class="label">Avg. Rating</span>
        </div>
        <div class="stat-card">
          <span class="number">{{ getMemberSince() }}</span>
          <span class="label">Member Since</span>
        </div>
      </section>

      <section class="activity-section">
        <h2 class="section-title">Recent Activity</h2>

        <div v-if="loading" class="loading-state">
          <p>Loading your activity...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
        </div>

        <div v-else-if="userReviews.length === 0" class="empty-state">
          <p>You haven't written any reviews yet.</p>
          <button class="primary-button">Write Your First Review</button>
        </div>

        <div v-else class="reviews-container">
          <div v-for="review in userReviews" :key="review.id" class="review-card">
            <div class="review-header">
              <h3 class="restaurant-name">{{ review.restaurant.name }}</h3>
              <div class="review-rating">
                <span class="star-icon">★</span>
                <span>{{ review.rating }}/5</span>
              </div>
            </div>

            <h4 class="review-title">{{ review.title }}</h4>
            <p class="review-body">{{ review.body }}</p>

            <div class="review-footer">
              <span class="review-date">{{ formatDate(review.created_at) }}</span>
              <div class="review-actions">
                <button class="action-button" @click="openEditModal(review)">Edit</button>
                <button class="action-button delete" @click="openDeleteConfirm(review.id)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Edit Review Modal -->
      <div v-if="showEditModal" class="modal-overlay">
        <div class="modal-content">
          <h2>Edit Review</h2>
          <form @submit.prevent="updateReview">
            <div class="form-group">
              <label for="reviewTitle">Title</label>
              <input
                id="reviewTitle"
                v-model="editingReview.title"
                type="text"
                required
              />
            </div>

            <div class="form-group">
              <label for="reviewRating">Rating</label>
              <select id="reviewRating" v-model="editingReview.rating" required>
                <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="reviewBody">Review</label>
              <textarea
                id="reviewBody"
                v-model="editingReview.body"
                rows="4"
                required
              ></textarea>
            </div>

            <div class="modal-actions">
              <button type="button" class="secondary-button" @click="closeEditModal">Cancel</button>
              <button type="submit" class="primary-button" :disabled="updating">
                {{ updating ? 'Updating...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteConfirm" class="modal-overlay">
        <div class="modal-content delete-confirm">
          <h2>Delete Review</h2>
          <p>Are you sure you want to delete this review? This action cannot be undone.</p>

          <div class="modal-actions">
            <button type="button" class="secondary-button" @click="cancelDelete">Cancel</button>
            <button
              type="button"
              class="danger-button"
              :disabled="deleting"
              @click="confirmDelete"
            >
              {{ deleting ? 'Deleting...' : 'Delete Review' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * User Profile Page
 *
 * Displays user profile information, statistics, and review history.
 * Allows users to view, edit and delete their restaurant reviews.
 */
export default {
  name: "Profile",
  /**
   * Component's reactive data
   * @returns {Object} The component's data properties
   */
  data() {
    return {
      /**
       * Indicates if the user is logged in
       * @type {boolean}
       */
      isLoggedIn: false,

      /**
       * User information from authentication
       * @type {Object|null}
       */
      user: null,

      /**
       * Authentication token
       * @type {string|null}
       */
      token: null,

      /**
       * Collection of user's reviews
       * @type {Array}
       */
      userReviews: [],

      /**
       * Indicates if data is currently being loaded
       * @type {boolean}
       */
      loading: true,

      /**
       * Error message if any operation fails
       * @type {string|null}
       */
      error: null,

      /**
       * Controls visibility of edit review modal
       * @type {boolean}
       */
      showEditModal: false,

      /**
       * Stores currently editing review data
       * @type {Object}
       * @property {number|null} id - Review ID
       * @property {string} title - Review title
       * @property {string} body - Review content
       * @property {number} rating - Review rating (1-5)
       */
      editingReview: {
        id: null,
        title: '',
        body: '',
        rating: 1
      },

      /**
       * Indicates if review update is in progress
       * @type {boolean}
       */
      updating: false,

      /**
       * Controls visibility of delete confirmation modal
       * @type {boolean}
       */
      showDeleteConfirm: false,

      /**
       * ID of review pending deletion
       * @type {number|null}
       */
      deletingReviewId: null,

      /**
       * Indicates if review deletion is in progress
       * @type {boolean}
       */
      deleting: false
    };
  },

  /**
   * Lifecycle hook that runs when component is created
   */
  created() {
    this.checkAuthentication();
  },

  methods: {
    /**
     * Verifies if user is authenticated by checking local storage
     * Sets isLoggedIn state and user data if authenticated
     */
    checkAuthentication() {
      // Get user data from localStorage
      const userData = localStorage.getItem('userData');

      if (userData) {
        try {
          const parsedData = JSON.parse(userData);
          this.token = parsedData.token;

          if (this.token) {
            this.isLoggedIn = true;
            this.user = parsedData.user;
            this.fetchUserData();
          } else {
            this.isLoggedIn = false;
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
          this.isLoggedIn = false;
        }
      } else {
        this.isLoggedIn = false;
      }
    },

    /**
     * Fetches user-specific data including reviews
     * Sets loading and error states accordingly
     */
    fetchUserData() {
      if (!this.isLoggedIn || !this.user?.id) {
        this.loading = false;
        return;
      }

      const userId = this.user.id;

      // Set up headers with bearer token
      const headers = {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      };

      // Fetch user reviews
      fetch(`${import.meta.env.VITE_API_URL}/reviews/reviewer/${userId}`, {
        method: 'GET',
        headers: headers
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch user reviews');
          }
          return response.json();
        })
        .then(data => {
          this.userReviews = Array.isArray(data) ? data : [data];
          this.loading = false;
        })
        .catch(error => {
          this.error = error.message;
          this.loading = false;
        });
    },

    /**
     * Formats a date string for display
     * Shows "Today at HH:MM" for today's dates
     *
     * @param {string} dateString - ISO date string to format
     * @returns {string} Formatted date string
     */
    formatDate(dateString) {
      if (!dateString) return '';

      const date = new Date(dateString);
      const today = new Date("2025-03-12T11:02:00");

      // Format options for date display
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };

      // If the date is today, show "Today at HH:MM"
      if (date.toDateString() === today.toDateString()) {
        return `Today at ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
      }

      // Otherwise show the formatted date
      return date.toLocaleDateString('en-US', options);
    },

    /**
     * Gets user's initials from name and surname
     *
     * @returns {string} User's initials or "?" if user data is unavailable
     */
    getUserInitials() {
      if (!this.user) return '?';

      const name = this.user.name || '';
      const surname = this.user.surname || '';

      return (name.charAt(0) + surname.charAt(0)).toUpperCase();
    },

    /**
     * Calculates average rating from user reviews
     *
     * @returns {string} Formatted average rating with one decimal place
     */
    getAverageRating() {
      if (!this.userReviews.length) return '0.0';

      const sum = this.userReviews.reduce((total, review) => total + review.rating, 0);
      return (sum / this.userReviews.length).toFixed(1);
    },

    /**
     * Gets formatted date showing how long user has been a member
     *
     * @returns {string} Month and year when user joined or "N/A" if unavailable
     */
    getMemberSince() {
      if (!this.user || !this.user.created_at) return 'N/A';

      const date = new Date(this.user.created_at);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    },

    /**
     * Opens the edit review modal with selected review data
     *
     * @param {Object} review - Review object to edit
     */
    openEditModal(review) {
      this.editingReview = {
        id: review.id,
        title: review.title,
        body: review.body,
        rating: review.rating
      };
      this.showEditModal = true;
    },

    /**
     * Closes the edit review modal and resets form
     */
    closeEditModal() {
      this.showEditModal = false;
      this.editingReview = {
        id: null,
        title: '',
        body: '',
        rating: 1
      };
    },

    /**
     * Updates a review with edited content
     * Sends PUT request to API with updated review data
     */
    updateReview() {
      this.updating = true;

      // Set up headers with bearer token
      const headers = {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      };

      // Prepare the data to send
      const reviewData = {
        title: this.editingReview.title,
        body: this.editingReview.body,
        rating: this.editingReview.rating
      };

      // Send PUT request to update the review
      fetch(`${import.meta.env.VITE_API_URL}/reviews/${this.editingReview.id}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(reviewData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to update review');
          }
          return response.json();
        })
        .then(data => {
          // Update the review in the local array
          const index = this.userReviews.findIndex(r => r.id === this.editingReview.id);
          if (index !== -1) {
            // Preserve the restaurant data from the original review
            this.userReviews[index] = {
              ...data,
              restaurant: this.userReviews[index].restaurant
            };
          }

          this.closeEditModal();
          this.updating = false;
        })
        .catch(error => {
          console.error('Error updating review:', error);
          this.error = error.message;
          this.updating = false;
        });
    },

    /**
     * Opens delete confirmation modal for a review
     *
     * @param {number} reviewId - ID of review to delete
     */
    openDeleteConfirm(reviewId) {
      this.deletingReviewId = reviewId;
      this.showDeleteConfirm = true;
    },

    /**
     * Cancels delete operation and closes confirmation modal
     */
    cancelDelete() {
      this.showDeleteConfirm = false;
      this.deletingReviewId = null;
    },

    /**
     * Confirms and processes review deletion
     * Sends DELETE request to API to remove review
     */
    confirmDelete() {
      if (!this.deletingReviewId) return;

      this.deleting = true;

      // Set up headers with bearer token
      const headers = {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      };

      // Send DELETE request
      fetch(`${import.meta.env.VITE_API_URL}/reviews/${this.deletingReviewId}`, {
        method: 'DELETE',
        headers: headers
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to delete review');
          }

          // Remove the review from the local array
          this.userReviews = this.userReviews.filter(review => review.id !== this.deletingReviewId);

          this.cancelDelete();
          this.deleting = false;
        })
        .catch(error => {
          console.error('Error deleting review:', error);
          this.error = error.message;
          this.deleting = false;
        });
    }
  }
};
</script>


<style scoped>
.profile-container {
  width: 100%;
  margin: 0 auto;
  padding: 40px 20px 80px;
  background-color: var(--color-bg-primary);
  min-height: calc(100vh - 80px); /* Adjust based on your header height */
}

.profile-header {
  display: flex;
  align-items: center;
  margin-bottom: 5vh;
}

.profile-avatar {
  margin-right: 2vw;
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 600;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.profile-email {
  font-size: 16px;
  color: var(--color-text-secondary);
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background-color: var(--color-bg-secondary);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.number {
  display: block;
  font-size: 36px;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.label {
  font-size: 16px;
  color: var(--color-text-secondary);
}

.activity-section {
  margin-top: 40px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--color-border-light);
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 40px;
  background-color: var(--color-bg-secondary);
  border-radius: 16px;
  color: var(--color-text-secondary);
}

.primary-button {
  padding: 12px 24px;
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 16px;
  transition: background-color 0.2s;
  text-decoration: none;
}

.primary-button:hover {
  background-color: var(--color-primary-dark);
}

.reviews-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.review-card {
  background-color: var(--color-bg-secondary);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.review-card:hover {
  transform: translateY(-5px);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.restaurant-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
}

.star-icon {
  color: var(--color-warning);
}

.review-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--color-text-primary);
}

.review-body {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
  line-height: 1.5;
  /* Limit to 3 lines with ellipsis */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border-light);
}

.review-date {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.review-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  padding: 6px 12px;
  background-color: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  background-color: var(--color-primary-100);
  color: var(--color-primary);
  border-color: var(--color-primary);
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: var(--color-bg-primary);
  border-radius: 16px;
  padding: 32px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
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

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  font-size: 16px;
  background-color: var(--color-bg-secondary);
}

.form-group textarea {
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.secondary-button {
  padding: 12px 24px;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-light);
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.secondary-button:hover {
  background-color: var(--color-bg-tertiary);
}

.primary-button:disabled {
  cursor: not-allowed;
}

.delete-confirm {
  max-width: 450px;
}

.delete-confirm p {
  margin: 16px 0 24px;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.danger-button {
  padding: 12px 24px;
  background-color: #e53935;
  color: white;
  border: none;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.danger-button:hover {
  background-color: #c62828;
}

.danger-button:disabled {
  cursor: not-allowed;
}

.action-button.delete:hover {
  background-color: rgba(229, 57, 53, 0.1);
  color: #e53935;
  border-color: #e53935;
}

.auth-warning {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 20px;
}

.warning-content {
  background-color: var(--color-bg-secondary);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  max-width: 500px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

.warning-content h2 {
  font-size: 24px;
  color: var(--color-primary);
  margin-bottom: 16px;
}

.warning-content p {
  font-size: 16px;
  color: var(--color-text-secondary);
  margin-bottom: 24px;
  line-height: 1.5;
}

.warning-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-avatar {
    margin-right: 0;
    margin-bottom: 16px;
  }

  .reviews-container {
    grid-template-columns: 1fr;
  }
}
</style>