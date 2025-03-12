<template>
  <header class="app-header">
    <div class="logo">
      <h1>Eatmatch</h1>
    </div>
    <div class="sections-container">
      <p class="nav-link">Contact us</p>
      <template v-if="!isLogged">
        <button class="auth-button login-button" @click="showLogin = true">Login</button>
        <button class="auth-button register-button" @click="showRegister = true">Register</button>
      </template>
      <template v-else>
        <span class="welcome-text">Welcome, {{ userName }}</span>
        <button class="auth-button logout-button" @click="logoutUser">Logout</button>
      </template>
    </div>
    <Login v-if="showLogin" @close="showLogin = false" />
    <Register v-if="showRegister" @close="showRegister = false" />
  </header>
</template>

<script>
import Login from './Login.vue';
import Register from './Register.vue';
import { useAuthStore } from '@/stores/authStore.js';

export default {
  name: "Header",
  components: { Register, Login },
  data() {
    return {
      showLogin: false,
      showRegister: false
    };
  },
  computed: {
    authStore() {
      return useAuthStore();
    },
    isLogged() {
      return this.authStore.isAuthenticated;
    },
    userName() {
      return this.authStore.userData ? this.authStore.userData.user.name : '';
    }
  },
  methods: {
    logoutUser() {
      this.$router.push('/');
      this.authStore.logout();
    }
  },
  mounted() {
    // Check if user exists in local storage on component mount
    this.authStore.checkLocalStorage();
  }
};
</script>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 16px;
  background-color: var(--color-bg-primary);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  margin: 0;
  z-index: 100;
}

.logo h1 {
  font-size: 24px;
  color: var(--color-primary);
  margin: 0;
  font-weight: 600;
  white-space: nowrap;
}

.sections-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: color 0.2s;
  margin: 0;
  white-space: nowrap;
}

.nav-link:hover {
  color: var(--color-primary);
}

.welcome-text {
  font-size: 15px;
  font-weight: 500;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.auth-button {
  padding: 10px 20px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  white-space: nowrap;
}

.login-button {
  background-color: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.login-button:hover {
  background-color: var(--color-primary-100);
}

.register-button, .logout-button {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.register-button:hover, .logout-button:hover {
  background-color: var(--color-primary-dark);
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .app-header {
    flex-wrap: wrap;
    justify-content: center;
    gap: 16px;
  }

  .logo {
    flex: 0 0 100%;
    text-align: center;
    margin-bottom: 10px;
  }

  .sections-container {
    order: 3;
    flex: 0 0 100%;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .sections-container {
    flex-wrap: wrap;
    gap: 12px;
  }

  .auth-button {
    padding: 8px 16px;
    font-size: 13px;
  }
}
</style>
