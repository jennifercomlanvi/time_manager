export const useAuthTokenStore = defineStore('authToken', () => {
  const token = ref(null)
  const username = ref(null)

  return { token, username }
})
