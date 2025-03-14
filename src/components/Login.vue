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

/**
 * Login Component
 *
 * Provides a modal form for user authentication with email and password.
 * Includes validation for both fields and displays appropriate error messages.
 *
 * @emits {Event} close - Emitted when user clicks the close button or successfully logs in
 */
export default {
  name: "Login",

  /**
   * Component's reactive data
   * @returns {Object} The component's data properties
   */
  data() {
    return {
      /**
       * User's email address
       * @type {string}
       */
      email: "",

      /**
       * User's password
       * @type {string}
       */
      password: "",

      /**
       * Error message for email validation
       * @type {string}
       */
      emailError: "",

      /**
       * Error message for password validation
       * @type {string}
       */
      passwordError: "",

      /**
       * Error message for login attempts
       * @type {string}
       */
      loginError: ""
    };
  },

  methods: {
    /**
     * Validates the email input
     * Checks if the email follows a valid format
     */
    validateEmail() {
      this.emailError = "";
      const validMail = validateMail(this.email)
      if (!validMail) {
        this.emailError = "Please enter a valid email address.";
      }
    },

    /**
     * Validates the password input
     * Checks if the password meets the minimum length requirement
     */
    validatePassword() {
      this.passwordError = "";
      const validPassword = validatePassword(this.password)
      if (!validPassword) {
        this.passwordError = "Password must be at least 8 characters long.";
      }
    },

    /**
     * Handles the login form submission
     * Validates the inputs, attempts authentication via the auth store,
     * and handles success/error states
     *
     * @async
     * @emits {Event} close - Emitted on successful login
     */
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
