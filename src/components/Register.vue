<template>
  <div class="user-modal">
    <form class="user-form" @submit.prevent="registerUser">
      <h2>Register</h2>

      <label for="name-textbox">Name:</label>
      <input
        type="text"
        v-model="name"
        name="name"
        id="name-textbox"
        @blur="validateName"
      />
      <p v-if="nameError" class="error">{{ nameError }}</p>

      <label for="email-textbox">Email address:</label>
      <input
        type="text"
        v-model="email"
        name="email"
        id="email-textbox"
        @blur="validateEmail"
      />
      <p v-if="emailError" class="error">{{ emailError }}</p>

      <label for="create-password-textbox">Create password:</label>
      <input
        type="password"
        v-model="createPassword"
        name="create-password"
        id="create-password-textbox"
        @blur="validateCreatePassword"
      />
      <p v-if="createPasswordError" class="error">{{ createPasswordError }}</p>

      <label for="repeat-password-textbox">Repeat password:</label>
      <input
        type="password"
        v-model="repeatPassword"
        name="repeat-password"
        id="repeat-password-textbox"
        @blur="validateRepeatPassword"
      />
      <p v-if="repeatPasswordError" class="error">{{ repeatPasswordError }}</p>

      <button type="submit">Register</button>
      <button type="button" @click="$emit('close')">Close</button>

      <p v-if="registerError" class="error">{{ registerError }}</p>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/authStore.js";

/**
 * Registration Form Component
 *
 * Provides a user registration form with field validation.
 * Handles user input, validates form fields, and submits registration data.
 */
export default {
  name: "Register",

  /**
   * Component data properties
   * @returns {Object} Component data
   */
  data() {
    return {
      /** @type {string} User's full name */
      name: "",

      /** @type {string} User's email address */
      email: "",

      /** @type {string} User's chosen password */
      createPassword: "",

      /** @type {string} Password confirmation entry */
      repeatPassword: "",

      /** @type {string} Error message for name validation */
      nameError: "",

      /** @type {string} Error message for email validation */
      emailError: "",

      /** @type {string} Error message for password validation */
      createPasswordError: "",

      /** @type {string} Error message for password confirmation validation */
      repeatPasswordError: "",

      /** @type {string} Error message for registration failures */
      registerError: ""
    };
  },

  methods: {
    /**
     * Validates the user's name
     * Checks if name meets minimum length requirements
     */
    validateName() {
      this.nameError = "";
      const validName = validateName(this.name)
      if (!validName) {
        this.nameError = "Name must be at least 3 characters long.";
      }
    },

    /**
     * Validates the user's email address
     * Checks if email is in a valid format
     */
    validateEmail() {
      this.emailError = "";
      const validMail = validateMail(this.email)
      if (!validMail) {
        this.emailError = "Please enter a valid email address.";
      }
    },

    /**
     * Validates the user's password
     * Checks if password meets minimum length requirements
     */
    validateCreatePassword() {
      this.createPasswordError = "";
      const validPassword = validatePassword(this.createPassword)
      if (!validPassword) {
        this.createPasswordError = "Password must be at least 8 characters long.";
      }
    },

    /**
     * Validates that password confirmation matches the original password
     * Checks if both passwords are identical
     */
    validateRepeatPassword() {
      this.repeatPasswordError = "";
      const validRepeatPassword = validateRepeatPassword(this.createPassword, this.repeatPassword)
      if (!validRepeatPassword) {
        this.repeatPasswordError = "Passwords do not match.";
      }
    },

    /**
     * Submits user registration data to the auth store
     * Validates all fields before submission and handles registration response
     *
     * @async
     * @returns {Promise<void>}
     */
    async registerUser() {
      // Clear previous error
      this.registerError = "";

      // Validate all fields
      this.validateName();
      this.validateEmail();
      this.validateCreatePassword();
      this.validateRepeatPassword();

      if (
        this.nameError ||
        this.emailError ||
        this.createPasswordError ||
        this.repeatPasswordError
      ) {
        return;
      }

      // Use the auth store for registration
      const authStore = useAuthStore();
      const [error, data] = await authStore.register({
        name: this.name,
        email: this.email,
        password: this.createPassword,
        password_confirmation: this.repeatPassword
      });

      if (error) {
        this.registerError = authStore.getErrors.message;
        return;
      }

      // Close the modal on successful registration
      this.$emit("close");
    }
  }
};
</script>

<style scoped>
</style>
