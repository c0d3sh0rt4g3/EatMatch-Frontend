<script>
export default {
  name: "Register"
}
</script>

<template>
  <form id="register-form">
    <h2>Register</h2>
    <label for="name-textbox">Name:</label>
    <input type="text" name="name" id="name-textbox">
    <label for="surname-textbox">Surname:</label>
    <input type="text" name="surname" id="surname-textbox">
    <label for="email-textbox">Email address:</label>
    <input type="text" name="email" id="email-textbox">
    <label for="create-password-textbox">Create password:</label>
    <input type="password" name="create-password" id="create-password-textbox">
    <label for="repeat-password-textbox">Repeat password:</label>
    <input type="password" name="repeat-password" id="repeat-password-textbox">
  </form>
</template>

<style scoped>

</style>