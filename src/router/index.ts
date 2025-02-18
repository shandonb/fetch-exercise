/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router/auto'
import { routes } from 'vue-router/auto-routes'

const publicRoutes = ['/'];

const enhancedRoutes = routes.map(route => {
  if (!publicRoutes.includes(route.path)) {
    return { ...route, meta: { requiresAuth: true } };
  }
  return route;
});

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: enhancedRoutes,
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  await auth.checkStatus();

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next("/");
  } else if (to.path == "/" && auth.isAuthenticated) {
    next("/dashboard");
  } else {
    next();
  }
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
