export const useAuthTokenStore = defineStore("authToken", () => {
  const { PUBLIC, CONNECTED, CONTROLED } = useScope();

  const userStore = useUserStore();

  // States
  const authLevel = ref(PUBLIC);

  const apiToken = reactive({
    access: null,
    exp: 0,
  });

  const refreshToken = reactive({
    access: null,
    exp: 0,
  });

  // Getters
  const isPublic = computed(() => authLevel.value >= PUBLIC);
  const isConnected = computed(() => authLevel.value >= CONNECTED);
  const isControled = computed(() => authLevel.value === CONTROLED);

  // Actions

  function setToken(data) {
    const timestamp = Date.now();
    console.log(data.has_control)
    // authLevel
    // authLevel.value = data.has_control ? CONNECTED : CONTROLED;
    authLevel.value = data.has_control ? CONTROLED : CONNECTED;

    // api token
    apiToken.access = data.access_token;
    apiToken.exp = timestamp + data.expire_in * 1000;
    useLocaleStorage.set("access", {
      token: apiToken.access,
      exp: apiToken.exp,
    });

    // refresh token
    if (data.refresh_token && data.refresh_in) {
      console.log(data.refresh_in)
      refreshToken.access = data.refresh_token;
      refreshToken.exp = timestamp + data.refresh_in * 1000;
      useLocaleStorage.set("refresh", {
        token: refreshToken.access,
        exp: refreshToken.exp,
      });
    } else {
      refreshToken.access = null;
      refreshToken.exp = 0;
      useLocaleStorage.remove("refresh");
    }

    userStore.setUser(data);
  }

  function refresh() {
    apiToken.access = null;
    apiToken.exp = 0;
  }

  function logout() {
    apiToken.access = null;
    apiToken.exp = 0;
    refreshToken.access = null;
    refreshToken.exp = 0;
    useLocaleStorage.remove("access");
    useLocaleStorage.remove("refresh");
    authLevel.value = PUBLIC;
    userStore.resetUser();

    const route = useRoute();
    const to = useRouteValidation(route);
    return to ? navigateTo(to, { replace: true }) : null;
  }

  /**
   * WARNING !: NE PAS UTILISER
   * Changer d'état de connexion implique aussi un changement d'access_token
   * (exception: quand on passe en état contrôlé le token ne change pas)
   */
  function setAuthLevel(data) {
    authLevel.value = data;
  }

  return {
    authLevel,
    apiToken,
    refreshToken,
    isPublic,
    isConnected,
    isControled,
    setToken,
    refresh,
    logout,
    setAuthLevel,
  };
});

if (import.meta.env.DEV && import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthTokenStore, import.meta.hot));
}
