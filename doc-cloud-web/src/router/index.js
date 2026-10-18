import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { getToken } from '@/utils/auth'

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由前置守卫：免登录白名单直接放行，其余无 token 跳转登录页
router.beforeEach((to) => {
  // 同步页面标题
  document.title = to.meta.title ? `${to.meta.title} - DocCloud 文档云` : 'DocCloud 文档云'

  if (to.meta.public) {
    return true
  }
  if (!getToken()) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  return true
})

export default router
