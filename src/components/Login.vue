<template>
  <div class="user-form-modal">
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
      // Validate fields on blur
      this.validateEmail();
      this.validatePassword();
      if (this.emailError || this.passwordError) {
        return;
      }
      try {
        // Send login credentials to the API endpoint.
        const response = await axios.post("http://localhost:8000/api/login", {
          email: this.email,
          password: this.password
        });
        console.log("Login successful:", response.data);

        // Store user data in local storage using helper.
        storeUser(response.data);

        // Update the Pinia store.
        const userStore = useUserStore();
        userStore.setUser(response.data);

        // Close the modal on successful login.
        this.$emit("close");
      } catch (error) {
        console.error("Login failed:", error.response ? error.response.data : error);
        this.loginError = "Error, Incorrect email or password";
      }
    }
  }
};
</script>

<style scoped>
#login-form {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}
.login-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  height: 40vh;
  width: 35vw;
}

/* Optional overlay styling */
.login-modal::before {
  content: "";
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
}
</style>
