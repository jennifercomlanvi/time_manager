export const useUserStore = defineStore("user", () => {
  // States

  const user = reactive({});

  // Actions

  function setUser(data) {
    user.uuid = data.uuid;
    user.name = data.name;
    user.email = data.email;
  }

  function resetUser() {
    setUser({
      uuid: null,
      name: null,
      email: null,
    });
  }

  return {
    user,
    setUser,
    resetUser,
  };
});

if (import.meta.env.DEV && import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
