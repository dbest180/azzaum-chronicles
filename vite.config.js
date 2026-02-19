// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/azzaum-chronicles/',
  plugins: [vue()],
  assetsInclude: ['**/*.md'], // tells Vite to treat .md as static assets
})
