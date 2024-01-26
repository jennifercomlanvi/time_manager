export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    // [
  //     '@pinia/nuxt',
  //     {
  //       autoImports: ['defineStore', 'acceptHMRUpdate'],
  //     },
  //   ],
    [
      'nuxt-primevue',
      {
        components: {
          prefix: 'P',
        },
      },
    ],
  ],
  css: [
    'primevue/resources/themes/md-light-indigo/theme.css',
    'primeflex/primeflex.css',
    'primeicons/primeicons.css',
  ]
  // // OTHER ----------------------------------------------------------------------------------------
  // imports: {
  //   dirs: ['stores'],
  // },
})
