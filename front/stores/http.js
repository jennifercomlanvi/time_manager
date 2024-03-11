export const useHttpStore = defineStore("http", () => {
  // Constant
  const NONE = 0;
  const ASYNC = 1;
  const SYNC = 2;

  // States
  const authPending = ref(NONE);

  const apiQueue = ref([]);

  // Actions
  function setAuthPending(data) {
    authPending.value = data;
  }

  function addApiQueue(data) {
    apiQueue.value.push(data);
  }

  function launchApiQueue() {
    apiQueue.value.forEach((req) => {
      req
        .promise()
        .then((response) => {
          req.resolve(response);
        })
        .catch((error) => {
          req.reject(error);
        });
    });
    apiQueue.value = [];
  }

  return {
    NONE,
    SYNC,
    ASYNC,
    authPending,
    apiQueue,
    setAuthPending,
    addApiQueue,
    launchApiQueue,
  };
});

if (import.meta.env.DEV && import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useHttpStore, import.meta.hot));
}
