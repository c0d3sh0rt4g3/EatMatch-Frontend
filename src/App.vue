<script>
import {defineComponent} from "vue";
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";
import Header from "@/components/Header.vue";
import Profile from "@/pages/Profile.vue";

export default defineComponent({
  components: {Profile, Header, Register, Login}
})
</script>

<template>
  <Header/>
  <router-view/>
</template>

<style>
  :root {
    /* Main brand colors */
    --color-primary: #ff6b6b;
    --color-primary-dark: #ff5252;
    --color-primary-light: #ff9292;

    /* Neutral colors */
    --color-white: #ffffff;
    --color-black: #000000;
    --color-gray-100: #f8f9fa;
    --color-gray-200: #e0e0e0;
    --color-gray-300: #cccccc;
    --color-gray-400: #999999;
    --color-gray-500: #666666;
    --color-gray-600: #444444;
    --color-gray-700: #333333;

    /* Tints and shades of primary color */
    --color-primary-100: #fff4f4;
    --color-primary-200: #ffe1e1;
    --color-primary-300: #ffcdcd;
    --color-primary-400: #ffb9b9;
    --color-primary-500: #ffa6a6;
    --color-primary-600: #ff7f7f;
    --color-primary-700: #ff6b6b;
    --color-primary-800: #f97171;
    --color-primary-900: #f47676;

    /* Semantic colors */
    --color-success: #4CAF50;
    --color-warning: #FFC107;
    --color-error: #F44336;
    --color-info: #2196F3;

    /* Text colors */
    --color-text-primary: var(--color-gray-700);
    --color-text-secondary: var(--color-gray-500);
    --color-text-tertiary: var(--color-gray-400);
    --color-text-inverse: var(--color-white);

    /* Background colors */
    --color-bg-primary: var(--color-white);
    --color-bg-secondary: var(--color-gray-100);
    --color-bg-tertiary: var(--color-gray-200);

    /* Border colors */
    --color-border-light: var(--color-gray-200);
    --color-border-medium: var(--color-gray-300);
    --color-border-dark: var(--color-gray-400);
  }

  * {
    margin: 0;
    box-sizing: border-box;
  }

  #app {
    font-family: 'Poppins', sans-serif;
    padding: 0;
    background-color: var(--color-gray-100);
    color: var(--color-gray-700);
    height: 100vh;
    width: 100%;
  }
  .user-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--color-bg-primary);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    height: 60vh;
    width: 35vw;
    border-radius: 16px;
    overflow: hidden;
  }

  .user-form {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    height: 100%;
    width: 100%;
  }

  .user-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--color-bg-primary);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    height: 60vh;
    width: 35vw;
    border-radius: 16px;
    overflow: hidden;
  }

  .user-modal::before {
    content: "";
    position: fixed;
  }

  .user-form h2 {
    color: var(--color-text-primary);
    font-size: 24px;
    margin-bottom: 0;
    font-weight: 600;
  }

  .user-form input {
    width: 80%;
    padding: 12px;
    border: 1px solid var(--color-border-light);
    border-radius: 24px;
    font-size: 14px;
    transition: border-color 0.2s;
  }

  .user-form input:focus {
    outline: 0;
    border-color: var(--color-primary);
  }

  .user-form button {
    padding: 12px;
    background-color: var(--color-primary);
    color: var(--color-text-inverse);
    border: none;
    border-radius: 24px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    width: 75%;
  }

  .user-form button:hover {
    background-color: var(--color-primary-dark);
  }

  .user-form .close-button {
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 24px;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: 4px;
    width: auto;
    margin: 0;
  }

  .user-form .close-button:hover {
    color: var(--color-primary);
  }

  .error {
    color: var(--color-error);
    margin-top: 0.5rem;
    font-size: 0.9rem;
    align-self: flex-start;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .user-modal {
      width: 90vw;
      height: auto;
      max-height: 80vh;
    }

    .user-form {
      padding: 20px;
    }
  }

  .form-footer a:hover {
    text-decoration: underline;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .user-modal {
      width: 90vw;
      height: auto;
      max-height: 80vh;
    }

    .user-form {
      padding: 20px;
    }
  }

</style>
