import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import WikiView from '../views/WikiView.vue' // This will be our generic page viewer

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      // The :slug part is dynamic. It matches /wiki/javascript, /wiki/css, etc.
      path: '/wiki/:slug', 
      name: 'wiki',
      component: WikiView
    }
  ]
})

export default router