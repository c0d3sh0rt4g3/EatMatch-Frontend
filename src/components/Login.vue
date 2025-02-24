<template>
  <div class="login-modal">
    <form id="login-form">
      <h2>Login</h2>
      <label for="email-textbox">Email address:</label>
      <input type="text" name="email" id="email-textbox">
      <label for="password-textbox">Password:</label>
      <input type="password" name="password" id="password-textbox">
      <!-- Button to close the login modal -->
      <button type="button" @click="$emit('close')">Close</button>
    </form>
  </div>
</template>

<script>
export default {
  name: "Login"
}
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
