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
  #app {
    height: 100vh;
  }
  .user-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    height: 60vh;
    width: 35vw;
  }
  .user-form {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    height: 100%;
    width: 100%;
  }
  /* Optional overlay styling */
.user-modal::before {
  content: "";
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
}
  .error {
  color: red;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}
</style>
