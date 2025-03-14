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
import { useAuthStore } from "@/stores/authStore.js";

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
      const validMail = validateMail(this.email)
      if (!validMail) {
        this.emailError = "Please enter a valid email address.";
      }
    },
    validateCreatePassword() {
      this.createPasswordError = "";
      const validPassword = validatePassword(this.createPassword)
      if (!validPassword)
        this.createPasswordError = "Password must be at least 8 characters long.";
      }
    },
    async loginUser() {
      // Clear previous error
      this.loginError = "";

      // Validate fields
      this.validateEmail();
      this.validatePassword();
      if (this.emailError || this.passwordError) {
        return;
      }

      // Use the auth store for login
      const authStore = useAuthStore();
      const [error, data] = await authStore.login({
        email: this.email,
        password: this.password
      });

      if (error) {
        this.loginError = authStore.getErrors.message;
        return;
      }

      // Close the modal on successful login
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
</style>
