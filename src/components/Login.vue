<template>
  <div class="user-modal">
    <form id="user-form">
      <h2>Login</h2>
      <label for="email-textbox">Email address:</label>
      <input type="text" name="email" id="email-textbox">
      <label for="password-textbox">Password:</label>
      <input type="password" name="password" id="password-textbox">
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
</style>
