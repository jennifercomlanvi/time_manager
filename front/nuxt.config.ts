// https://v3.nuxtjs.org/api/configuration/nuxt.config
import { env } from "process";

import confDev from "./config/developpement.json";
import confProd from "./config/production.json";

const config = env.VITE_MODE === "production" ? confProd : confDev;
export default defineNuxtConfig({
  // BUILD ----------------------------------------------------------------------------------------
  devServer: {
    port: config.port,
  },
 // MODULES --------------------------------------------------------------------------------------
 devtools: { enabled: true },
 modules: [
   [
     '@pinia/nuxt',
     {
       autoImports: ['defineStore', 'acceptHMRUpdate'],
     },
   ],
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
   '~/assets/styles/global.scss'

 ],
 // OTHER ----------------------------------------------------------------------------------------
 imports: {
   dirs: ['stores'],
 },
})
