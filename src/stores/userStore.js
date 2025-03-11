import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    logged: false,
    userData: null
  }),
  actions: {
    setUser(userData) {
      this.userData = userData;
      this.logged = true;
    },
    logout() {
      this.userData = null;
      this.logged = false;
    }
  }
});
