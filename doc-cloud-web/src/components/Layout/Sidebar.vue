<script setup>
// 侧边导航：Logo + 主菜单（消息角标联动 messageStore）
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMessageStore } from '@/stores/messageStore'

const route = useRoute()
const messageStore = useMessageStore()

// 菜单配置（icon 为全局注册的 Element Plus 图标名）
const menus = [
  { path: '/workspace', title: '工作台', icon: 'HomeFilled' },
  { path: '/team/list', title: '团队空间', icon: 'User' },
  { path: '/message', title: '消息中心', icon: 'Bell', badge: true },
  { path: '/profile', title: '个人中心', icon: 'Setting' }
]

// 当前激活菜单（团队详情页也高亮「团队空间」）
const activeMenu = computed(() => (route.path.startsWith('/team') ? '/team/list' : route.path))
</script>

<template>
  <div class="sidebar">
    <!-- Logo -->
    <div class="logo">
      <el-icon color="var(--doc-primary)" :size="22"><Reading /></el-icon>
      <span class="logo-title">DocCloud</span>
    </div>
    <!-- 导航菜单 -->
    <el-menu :default-active="activeMenu" router class="sidebar-menu">
      <el-menu-item v-for="menu in menus" :key="menu.path" :index="menu.path">
        <el-icon><component :is="menu.icon" /></el-icon>
        <template #title>
          <el-badge
            v-if="menu.badge && messageStore.unreadCount > 0"
            :value="messageStore.unreadCount"
            :max="99"
            class="menu-badge"
          >
            <span>{{ menu.title }}</span>
          </el-badge>
          <span v-else>{{ menu.title }}</span>
        </template>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<style scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid var(--doc-border);
}
.logo {
  height: 56px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px;
  border-bottom: 1px solid var(--doc-border);
}
.logo-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--doc-primary);
}
.sidebar-menu {
  border-right: none;
  flex: 1;
}
.menu-badge :deep(.el-badge__content) {
  transform: translateY(-2px);
}
</style>
