<script>
import {defineComponent} from "vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";

export default defineComponent({
  components: {Register, Login}
})
</script>

<template>
  <h1>EatMatch Frontend</h1>
  <Login/>
  <Register/>
</template>

<style scoped>
</style>
