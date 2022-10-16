import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '../views/layouts/DefaultLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '',
      component: DefaultLayout,
      children: [
        {
          path: 'login',
          name: 'Login',
          component: () => import('../views/pages/LoginView.vue')
        },
        {
          path: 'register',
          name: 'Register',
          component: () => import('../views/pages/RegisterView.vue')
        },
        {
          path: '/',
          name: 'home',
          component: () => import('../views/pages/HomeView.vue')
        },
      ]
    },
  ]
})

export default router
