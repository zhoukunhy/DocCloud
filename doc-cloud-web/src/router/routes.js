/**
 * 路由表
 * 1. 免登录路由：/login、/register、/share/:shareId（访客页，独立布局，meta.public = true）
 * 2. 需登录页面统一使用 Layout 主布局容器（挂在 / 下的 children）
 * 3. 404 重定向到 /workspace
 */
import Layout from '@/components/Layout/index.vue'

export default [
  // ========== 免登录路由（独立布局，不使用 Layout） ==========
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/Login.vue'),
    meta: { title: '登录', public: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/login/Register.vue'),
    meta: { title: '注册', public: true }
  },
  {
    path: '/share/:shareId',
    name: 'ShareDoc',
    component: () => import('@/views/share/ShareDoc.vue'),
    meta: { title: '分享文档', public: true }
  },

  // ========== 主布局路由（需登录） ==========
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/workspace',
    children: [
      {
        path: 'workspace',
        name: 'Workspace',
        component: () => import('@/views/workspace/Workspace.vue'),
        meta: { title: '工作台' }
      },
      {
        path: 'doc/edit/:docId',
        name: 'DocEdit',
        component: () => import('@/views/doc/DocEdit.vue'),
        meta: { title: '文档编辑' }
      },
      {
        path: 'doc/version/:docId',
        name: 'DocVersion',
        component: () => import('@/views/doc/DocVersion.vue'),
        meta: { title: '文档版本' }
      },
      {
        path: 'doc/compare/:docId',
        name: 'DocCompare',
        component: () => import('@/views/doc/DocCompare.vue'),
        meta: { title: '版本对比' }
      },
      {
        path: 'team/list',
        name: 'TeamList',
        component: () => import('@/views/team/TeamList.vue'),
        meta: { title: '团队列表' }
      },
      {
        path: 'team/detail/:teamId',
        name: 'TeamDetail',
        component: () => import('@/views/team/TeamDetail.vue'),
        meta: { title: '团队空间' }
      },
      {
        path: 'search',
        name: 'SearchResult',
        component: () => import('@/views/search/SearchResult.vue'),
        meta: { title: '全文检索' }
      },
      {
        path: 'message',
        name: 'MessageList',
        component: () => import('@/views/message/MessageList.vue'),
        meta: { title: '消息中心' }
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/user/UserProfile.vue'),
        meta: { title: '个人中心' }
      }
    ]
  },

  // 404 兜底：重定向到工作台
  {
    path: '/:pathMatch(.*)*',
    redirect: '/workspace'
  }
]
