import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/azzaum-chronicles/', // Only the repo name, wrapped in slashes
})