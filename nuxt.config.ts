// https://nuxt.com/docs/api/configuration/nuxt-config
import renderer from "vite-plugin-electron-renderer";

export default defineNuxtConfig({
  modules: ["nuxt-quasar-ui"],
  quasar: {
    extras: {
      fontIcons: ['material-icons']
    }
  },
  vite: {
    plugins: [
      renderer({
        nodeIntegration: true,
      }),
    ],
  },

});
