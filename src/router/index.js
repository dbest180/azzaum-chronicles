import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  // This ensures the router knows we are in a subfolder /azzaum-chronicles/
  history: createWebHistory(import.meta.env.BASE_URL), 
  routes: [
    { path: '/', component: HomeView },
    { path: '/wiki/:id', component: () => import('../views/WikiView.vue') }
  ]
})

export default router
