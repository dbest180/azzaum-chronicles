import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/https://github.com/dbest180/azzaum-chronicles/', // Critical for GitHub Pages
})