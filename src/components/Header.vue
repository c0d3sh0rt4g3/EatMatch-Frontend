<template>
  <header class="header">
    <p>Eatmatch</p>
    <div class="sections-container">
      <p>Make a review</p>
      <p>Contact us</p>
      <!-- Clicking the button sets the flag to true -->
      <button @click="showLogin = true">Login</button>
      <button @click="showRegister = true">Register</button>
    </div>
    <!-- Conditionally render the Login component -->
    <Login v-if="showLogin" @close="showLogin = false" />
    <Register v-if="showRegister" @close="showRegister = false"/>
  </header>
</template>

<script>
import Login from './Login.vue'
import Register from './Register.vue'

export default {
  name: "Header",
  components: {Register, Login },
  data() {
    return {
      showLogin: false,
      showRegister: false
    }
  }
}
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
