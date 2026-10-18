<script setup>
// 主布局：左侧边栏 + 顶部栏 + 内容区
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import { useWorkspaceStore } from '@/stores/workspaceStore'

const workspaceStore = useWorkspaceStore()
</script>

<template>
  <el-container class="layout-container">
    <!-- 左侧导航 -->
    <el-aside :width="workspaceStore.sidebarCollapsed ? '64px' : '220px'" class="layout-aside">
      <Sidebar />
    </el-aside>
    <el-container>
      <!-- 顶部栏 -->
      <el-header class="layout-header" height="56px">
        <Header />
      </el-header>
      <!-- 内容区 -->
      <el-main class="layout-main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.layout-container {
  height: 100%;
}
.layout-aside {
  transition: width 0.2s;
  overflow: hidden;
}
.layout-header {
  padding: 0;
  background: #fff;
  border-bottom: 1px solid var(--doc-border);
}
.layout-main {
  padding: 0;
  overflow-y: auto;
}
</style>
