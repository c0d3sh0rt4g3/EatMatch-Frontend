<template>
  <header class="header">
    <p>Eatmatch</p>
    <div class="sections-container">
      <p>Make a review</p>
      <p>Contact us</p>
      <template v-if="!isLogged">
        <button @click="showLogin = true">Login</button>
        <button @click="showRegister = true">Register</button>
      </template>
      <template v-else>
        <span>Welcome, {{ userName }}</span>
        <button @click="logoutUser">Logout</button>
      </template>
    </div>
    <Login v-if="showLogin" @close="showLogin = false" />
    <Register v-if="showRegister" @close="showRegister = false" />
  </header>
</template>

<script>
import Login from './Login.vue';
import Register from './Register.vue';
import { useUserStore } from '@/stores/userStore.js';

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
    // Import the store as a computed property
    userStore() {
      return useUserStore();
    },
    isLogged() {
      return this.userStore.logged;
    },
    userName() {
      return this.userStore.user ? this.userStore.user.surname : '';
    }
  },
  methods: {
    logoutUser() {
      this.userStore.logout();
      localStorage.removeItem("user");
    }
  }
};
</script>

<style scoped>
.header {
  /* Your header styles here */
}
.sections-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}
button {
  cursor: pointer;
}
</style>
