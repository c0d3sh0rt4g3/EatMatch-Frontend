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
import axios from "axios";
import { storeUser } from "@/helpers/storeUser.js";
import { useUserStore } from "@/stores/userStore.js";

export default {
  name: "Register",
  data() {
    return {
      name: "",
      email: "",
      createPassword: "",
      repeatPassword: "",
      nameError: "",
      emailError: "",
      createPasswordError: "",
      repeatPasswordError: "",
      registerError: ""
    };
  },
  methods: {
    validateName() {
      this.nameError = "";
      if (!this.name || this.name.trim().length < 3) {
        this.nameError = "Name must be at least 3 characters long.";
      }
    },
    validateEmail() {
      this.emailError = "";
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.email)) {
        this.emailError = "Please enter a valid email address.";
      }
    },
    validateCreatePassword() {
      this.createPasswordError = "";
      if (!this.createPassword || this.createPassword.length < 6) {
        this.createPasswordError = "Password must be at least 6 characters long.";
      }
    },
    validateRepeatPassword() {
      this.repeatPasswordError = "";
      if (this.repeatPassword !== this.createPassword) {
        this.repeatPasswordError = "Passwords do not match.";
      }
    },
    async registerUser() {
      // Trigger validations on blur and before submit.
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

      try {
        // Send registration data to the API endpoint.
        const response = await axios.post("http://localhost:8000/api/register", {
          name: this.name,
          email: this.email,
          password: this.createPassword
        });
        console.log("Registration successful:", response.data);

        // Store user data in local storage using the helper.
        storeUser(response.data);

        // Update the Pinia store.
        const userStore = useUserStore();
        userStore.setUser(response.data);

        // Close the modal on successful registration.
        this.$emit("close");
      } catch (error) {
        console.error("Registration failed:", error.response ? error.response.data : error);
        this.registerError = "Registration failed. Please try again later.";
      }
    }
  }
};
</script>

<style scoped>
</style>
