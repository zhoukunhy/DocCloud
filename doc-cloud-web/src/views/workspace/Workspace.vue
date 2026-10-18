<script setup>
// 工作台首页：左目录树 + 右快捷操作与最近编辑（mock 数据）
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { useDocTree } from '@/hooks/useDocTree'
import DocTree from '@/components/DocTree/index.vue'
import { formatRelativeTime } from '@/utils/format'

const router = useRouter()
const workspaceStore = useWorkspaceStore()

// 目录树逻辑（mock）
const { treeData, loading, loadTree, addNode, renameNode, removeNode } = useDocTree()

// 最近编辑文档（mock）
const recentDocs = ref([
  { id: '1111', title: 'SpringCloud Alibaba 入门', spaceLabel: '个人空间', updateTime: '2026-10-18 21:30:00' },
  { id: '1112', title: 'Nacos 注册中心踩坑记录', spaceLabel: '个人空间', updateTime: '2026-10-17 22:10:00' },
  { id: '2101', title: '前端架构演进方案', spaceLabel: '前端技术组', updateTime: '2026-10-15 11:00:00' },
  { id: '1201', title: '八股文整理：JVM', spaceLabel: '个人空间', updateTime: '2026-10-12 09:20:00' }
])

/** 空间切换（mock：团队空间取样例团队 101） */
async function onSpaceChange(spaceType) {
  await workspaceStore.switchSpace(spaceType, spaceType === 'TEAM' ? '101' : '')
}

/** 新建文档：弹输入框 → mock 创建 → 直接进编辑页 */
async function handleCreateDoc(parentId = '0') {
  const { value } = await ElMessageBox.prompt('请输入文档标题', '新建文档', {
    inputPattern: /\S+/,
    inputErrorMessage: '标题不能为空'
  })
  const node = await addNode(parentId, value.trim(), 'doc')
  ElMessage.success('创建成功')
  router.push(`/doc/edit/${node.id}`)
}

/** 目录树事件 */
function onNodeClick(node) {
  router.push(`/doc/edit/${node.id}`)
}
async function onRename(nodeId, title) {
  await renameNode(nodeId, title)
  ElMessage.success('重命名成功')
}
async function onDelete(nodeId) {
  await removeNode(nodeId)
  ElMessage.success('删除成功')
}

onMounted(loadTree)
</script>

<template>
  <div class="workspace flex">
    <!-- 左：文档目录树 -->
    <div class="workspace-tree">
      <DocTree
        :tree-data="treeData"
        :loading="loading"
        @node-click="onNodeClick"
        @create-doc="handleCreateDoc"
        @rename-doc="onRename"
        @delete-doc="onDelete"
      />
    </div>
    <!-- 右：欢迎 + 快捷操作 + 最近编辑 -->
    <div class="workspace-main page-container">
      <div class="welcome">
        <h2 class="welcome-title">欢迎回来，开始今天的知识沉淀</h2>
        <div class="space-switch">
          <span class="text-secondary">当前空间：</span>
          <el-radio-group :model-value="workspaceStore.spaceType" size="small" @change="onSpaceChange">
            <el-radio-button value="PERSONAL">个人空间</el-radio-button>
            <el-radio-button value="TEAM">团队空间</el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <!-- 快捷操作 -->
      <div class="quick-actions">
        <el-card shadow="hover" class="quick-card" @click="handleCreateDoc()">
          <el-icon :size="26" color="var(--doc-primary)"><EditPen /></el-icon>
          <p>新建文档</p>
        </el-card>
        <el-card shadow="hover" class="quick-card" @click="router.push('/team/list')">
          <el-icon :size="26" color="var(--doc-success)"><User /></el-icon>
          <p>团队空间</p>
        </el-card>
        <el-card shadow="hover" class="quick-card" @click="router.push('/search')">
          <el-icon :size="26" color="var(--doc-warning)"><Search /></el-icon>
          <p>全文检索</p>
        </el-card>
        <el-card shadow="hover" class="quick-card" @click="router.push('/message')">
          <el-icon :size="26" color="var(--doc-danger)"><Bell /></el-icon>
          <p>消息中心</p>
        </el-card>
      </div>
      <!-- 最近编辑 -->
      <el-card shadow="never" class="recent-card">
        <template #header>
          <span class="recent-title">最近编辑</span>
        </template>
        <div
          v-for="doc in recentDocs"
          :key="doc.id"
          class="recent-item"
          @click="router.push(`/doc/edit/${doc.id}`)"
        >
          <el-icon color="var(--doc-primary)"><Document /></el-icon>
          <span class="recent-doc-title text-ellipsis">{{ doc.title }}</span>
          <el-tag size="small" type="info">{{ doc.spaceLabel }}</el-tag>
          <span class="recent-time text-secondary">{{ formatRelativeTime(doc.updateTime) }}</span>
        </div>
        <el-empty v-if="recentDocs.length === 0" description="暂无最近编辑的文档" :image-size="80" />
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.workspace {
  height: calc(100vh - 56px);
}
.workspace-tree {
  width: 280px;
  height: 100%;
  flex-shrink: 0;
  border-right: 1px solid var(--doc-border);
}
.workspace-main {
  flex: 1;
  overflow-y: auto;
}
.welcome {
  margin-bottom: 16px;
}
.welcome-title {
  margin: 0 0 12px;
  font-size: 18px;
}
.quick-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}
.quick-card {
  width: 140px;
  text-align: center;
  cursor: pointer;
}
.quick-card p {
  margin: 8px 0 0;
  font-size: 13px;
}
.recent-card {
  max-width: 900px;
}
.recent-title {
  font-weight: 600;
}
.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
}
.recent-item:hover {
  background: #f5f7fa;
}
.recent-doc-title {
  flex: 1;
}
.recent-time {
  font-size: 12px;
}
</style>
