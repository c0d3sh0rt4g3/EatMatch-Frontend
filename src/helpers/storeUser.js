// This helper function saves the user data in local storage.
// It can be imported in other components, like the registration component.
export function storeUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
}
