<script>
import {defineComponent} from "vue";
import Login from "@/components/Login.vue";
import Register from "@/components/Register.vue";
import Header from "@/components/Header.vue";
import Profile from "@/views/Profile.vue";

export default defineComponent({
  components: {Profile, Header, Register, Login}
})
</script>

<template>
  <Header/>
  <h1>EatMatch Frontend</h1>
  <Profile/>
</template>

<style scoped>
</style>
