// https://router.vuejs.org/guide/advanced/navigation-guards.html
// https://router.vuejs.org/guide/advanced/meta.html

import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import SwipesView from '@/views/SwipesView.vue'
import ProfileView from '@/views/ProfileView.vue'
import MatchesView from '@/views/MatchesView.vue'
import InboxView from '@/views/InboxView.vue'
import UsersView from '@/views/UsersView.vue'
import LikedView from '@/views/LikedView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true, }
    },
    {
      path: '/swipe',
      name: 'swipe',
      component: SwipesView,
      meta: { requiresAuth: true, }
    },
    {
      path: '/matches',
      name: 'matches',
      component: MatchesView,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/liked',
      name: 'liked',
      component: LikedView,
      meta: {
        requiresAuth: true,
      }
    },
    {
      path: '/inbox',
      name: 'inbox',
      component: InboxView,
      meta: { requiresAuth: true, }
    },
    {
      path: '/inbox/chat/:userId',
      name: 'Chat',
      component: InboxView,
      meta: { requiresAuth: true, },
      props: true,
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
      }
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    }
  ],
})

router.beforeEach((to, from) => {
  const store = useAuthStore()
  const authPages = ['login', 'signup']

  if (to.meta.requiresAuth && !store.current_user) {
    return {
      name: 'login',
      query: { redirect: to.fullPath }
    }
  }

  if (authPages.includes(to.name) && store.current_user) {
    return { name: 'profile' }
  }

  if (to.meta.requiresAdmin && !store.admin) {
    alert('Forbidden! This page is for authorized users only!')
    return { name: 'home' }
  }  
})

export default router
