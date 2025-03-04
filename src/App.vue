<script>
import {defineComponent} from "vue";
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";
import Header from "@/components/Header.vue";

export default defineComponent({
  components: {Header, Register, Login}
})
</script>

<template>
  <Header/>
  <h1>EatMatch Frontend</h1>
</template>

<style scoped>
</style>
