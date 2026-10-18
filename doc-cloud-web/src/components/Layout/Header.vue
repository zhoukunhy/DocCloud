<script setup>
// 顶部栏：折叠按钮 + 面包屑 + 全局搜索 + 用户下拉
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/userStore'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import Breadcrumb from './Breadcrumb.vue'
import SearchInput from '@/components/common/SearchInput.vue'

const router = useRouter()
const userStore = useUserStore()
const workspaceStore = useWorkspaceStore()

/** 用户下拉命令 */
async function onUserCommand(command) {
  if (command === 'profile') {
    router.push('/profile')
  } else if (command === 'logout') {
    await ElMessageBox.confirm('确定退出登录吗？', '提示', { type: 'warning' })
    await userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  }
}
</script>

<template>
  <div class="header">
    <!-- 左侧：折叠 + 面包屑 -->
    <div class="header-left">
      <el-icon class="collapse-btn" :size="18" @click="workspaceStore.toggleSidebar()">
        <Expand v-if="workspaceStore.sidebarCollapsed" />
        <Fold v-else />
      </el-icon>
      <Breadcrumb class="header-breadcrumb" />
    </div>
    <!-- 右侧：搜索 + 用户 -->
    <div class="header-right">
      <SearchInput class="header-search" />
      <el-dropdown trigger="click" @command="onUserCommand">
        <span class="user-info">
          <el-avatar :size="30" class="user-avatar">{{ userStore.nickname.slice(0, 1) }}</el-avatar>
          <span class="user-name">{{ userStore.nickname }}</span>
          <el-icon :size="12"><ArrowDown /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">
              <el-icon><User /></el-icon>个人中心
            </el-dropdown-item>
            <el-dropdown-item command="logout" divided>
              <el-icon><SwitchButton /></el-icon>退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.header {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.collapse-btn {
  cursor: pointer;
  color: var(--doc-text-secondary);
}
.collapse-btn:hover {
  color: var(--doc-primary);
}
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  outline: none;
}
.user-avatar {
  background: var(--doc-primary);
  color: #fff;
  font-size: 14px;
}
.user-name {
  font-size: 14px;
}
</style>
