<template>
  <div class="user-modal">
    <form class="user-form" @submit.prevent="loginUser">
      <h2>Login</h2>

      <label for="email-textbox">Email address:</label>
      <input
        type="text"
        v-model="email"
        name="email"
        id="email-textbox"
        @blur="validateEmail"
      />
      <p v-if="emailError" class="error">{{ emailError }}</p>

      <label for="password-textbox">Password:</label>
      <input
        type="password"
        v-model="password"
        name="password"
        id="password-textbox"
        @blur="validatePassword"
      />
      <p v-if="passwordError" class="error">{{ passwordError }}</p>

      <button type="submit">Login</button>
      <button type="button" @click="$emit('close')">Close</button>

      <p v-if="loginError" class="error">{{ loginError }}</p>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { storeUser } from "@/helpers/storeUser.js";
import { useUserStore } from "@/stores/userStore.js";
import authService from "@/services/authService.js";

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      emailError: "",
      passwordError: "",
      loginError: ""
    };
  },
  methods: {
    validateEmail() {
      this.emailError = "";
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.email)) {
        this.emailError = "Please enter a valid email address.";
      }
    },
    validatePassword() {
      this.passwordError = "";
      if (!this.password || !this.password.trim()) {
        this.passwordError = "Please enter a valid password.";
      }
    },
    async loginUser() {
      this.validateEmail();
      this.validatePassword();
      if (this.emailError || this.passwordError) {
        return;
      }

      const [error, userData] = await authService.login(this.email, this.password);

      if (error) {
        this.loginError = "Error, Incorrect email or password";
        return;
      }

      // Store user data in local storage using helper
      storeUser(userData);

      // Update the Pinia store
      const userStore = useUserStore();
      userStore.setUser(userData);

      // Close the modal on successful login
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
</style>
