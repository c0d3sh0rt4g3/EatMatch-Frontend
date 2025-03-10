import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    logged: false,
    user: null
  }),
  actions: {
    setUser(userData) {
      this.user = userData;
      this.logged = true;
    },
    logout() {
      this.user = null;
      this.logged = false;
    }
  }
});
