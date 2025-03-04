<script>
export default {
  name: "Register"
}
</script>

<template>
  <div class="register-modal">
    <form id="register-form">
      <h2>Register</h2>
      <label for="surname-textbox">Surname:</label>
      <input type="text" name="surname" id="surname-textbox">

      <label for="email-textbox">Email address:</label>
      <input type="text" name="email" id="email-textbox">

      <label for="create-password-textbox">Create password:</label>
      <input type="password" name="create-password" id="create-password-textbox">

      <label for="repeat-password-textbox">Repeat password:</label>
      <input type="password" name="repeat-password" id="repeat-password-textbox">
      <button type="button" @click="$emit('close')">Close</button>
    </form>
  </div>
</template>

<style scoped>
#register-form {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
}
.register-modal {
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
.register-modal::before {
  content: "";
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
}
</style>