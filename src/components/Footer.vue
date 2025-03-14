<script>
import {useAuthStore} from "@/stores/authStore.js";

/**
 * Footer navigation component
 *
 * Displays a bottom navigation bar with home, explore, and profile links.
 * The profile link is only shown when the user is authenticated.
 */
export default {
  name: "Footer",
  computed: {
    /**
     * Returns the authentication store instance
     *
     * @returns {Object} The authentication store with user state and methods
     */
    authStore() {
      return useAuthStore();
    },

    /**
     * Checks if the user is currently logged in
     *
     * @returns {boolean} True if the user is authenticated, false otherwise
     */
    isLogged() {
      return this.authStore.isAuthenticated
    }
  }
}
</script>

<template>
<footer class="bottom-footer">
  <router-link to="/" class="footer-item" active-class="active">
    <span class="footer-icon">🏠</span>
    <span class="footer-text">Home</span>
  </router-link>

  <router-link to="/restaurants" class="footer-item" active-class="active">
    <span class="footer-icon">🔍</span>
    <span class="footer-text">Explore</span>
  </router-link>
  <template v-if="isLogged">
    <router-link to="/profile" class="footer-item" active-class="active">
      <span class="footer-icon">👤</span>
      <span class="footer-text">Profile</span>
    </router-link>
  </template>
</footer>
</template>

<style scoped>
/* Bottom Navigation */
.bottom-footer {
  display: flex;
  justify-content: space-around;
  background-color: var(--color-bg-primary);
  padding: 12px 0;
  position: fixed;
  bottom: 0;
  width: 100%;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.footer-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px 0;
  width: 25%;
  text-decoration: none;
  color: inherit;
}

.footer-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.footer-text {
  font-size: 12px;
  font-weight: 500;
}

.footer-item.active {
  color: var(--color-primary);
}
</style>
