import routes from './routes'
import { createRouter, createWebHashHistory } from 'vue-router'
import store from 'src/store'

const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior: () => ({
    x: 0,
    y: 0
  }),
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
  routes // short for `routes: routes`
})

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = store.getters

  if (to.name === 'login') {
    if (isAuthenticated) {
      next({ name: 'users' })
      return
    }
  }

  if (to.path === '/') {
    if (isAuthenticated) {
      next({ name: 'receipts' })
      return
    }
    if (!isAuthenticated) {
      next({ name: 'login' })
      return
    }
  }

  next()
})

export default router
