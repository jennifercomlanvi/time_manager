export const useRouterStore = defineStore("router", () => {
  // States
  const pending = ref(false);

  // Actions
  function setPending(data) {
    pending.value = data;
  }

  return {
    pending,
    setPending,
  };
});

if (import.meta.env.DEV && import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRouterStore, import.meta.hot));
}
