<script setup>
// 文档目录树组件（阶段5 mock 数据渲染）
// 纯展示组件：树数据由外部传入，节点点击/操作通过事件上抛
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  treeData: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  currentDocId: { type: String, default: '' }
})

const emit = defineEmits(['node-click', 'create-doc', 'rename-doc', 'delete-doc'])

const treeRef = ref()
// el-tree 字段映射
const treeProps = { label: 'title', children: 'children' }

/** 点击节点：文档节点上抛，文件夹由 el-tree 自行展开 */
function handleNodeClick(data) {
  if (data.nodeType === 'doc') {
    emit('node-click', data)
  }
}

/** 新建文档：传入文件夹节点则挂其下，否则挂根目录 */
function handleCreate(data) {
  const parentId = data?.nodeType === 'folder' ? data.id : '0'
  emit('create-doc', parentId)
}

/** 重命名 */
async function handleRename(data) {
  const { value } = await ElMessageBox.prompt('请输入新名称', '重命名', {
    inputValue: data.title,
    inputPattern: /\S+/,
    inputErrorMessage: '名称不能为空'
  })
  emit('rename-doc', data.id, value.trim())
}

/** 删除 */
function handleDelete(data) {
  ElMessageBox.confirm(`确定删除「${data.title}」吗？`, '删除确认', { type: 'warning' })
    .then(() => emit('delete-doc', data.id))
    .catch(() => {})
}
</script>

<template>
  <div v-loading="loading" class="doc-tree">
    <div class="doc-tree-header">
      <span class="doc-tree-title">文档目录</span>
      <el-tooltip content="新建文档" placement="top">
        <el-icon class="doc-tree-add" :size="18" @click="handleCreate(null)"><Plus /></el-icon>
      </el-tooltip>
    </div>
    <el-scrollbar class="doc-tree-body">
      <el-tree
        ref="treeRef"
        :data="treeData"
        :props="treeProps"
        node-key="id"
        highlight-current
        :expand-on-click-node="false"
        default-expand-all
        @node-click="handleNodeClick"
      >
        <template #default="{ data }">
          <div class="tree-node">
            <el-icon :size="14" :class="data.nodeType === 'folder' ? 'node-folder' : 'node-doc'">
              <Folder v-if="data.nodeType === 'folder'" />
              <Document v-else />
            </el-icon>
            <span class="tree-node-title text-ellipsis">{{ data.title }}</span>
            <!-- 悬停操作区（阻止冒泡避免触发行点击） -->
            <span class="tree-node-actions" @click.stop>
              <el-icon :size="13" title="新建子文档" @click="handleCreate(data)"><Plus /></el-icon>
              <el-icon :size="13" title="重命名" @click="handleRename(data)"><EditPen /></el-icon>
              <el-icon :size="13" title="删除" @click="handleDelete(data)"><Delete /></el-icon>
            </span>
          </div>
        </template>
      </el-tree>
      <el-empty
        v-if="!loading && treeData.length === 0"
        description="暂无文档，点击右上角 + 新建"
        :image-size="80"
      />
    </el-scrollbar>
  </div>
</template>

<style scoped>
.doc-tree {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.doc-tree-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--doc-border);
}
.doc-tree-title {
  font-weight: 600;
}
.doc-tree-add {
  cursor: pointer;
  color: var(--doc-primary);
}
.doc-tree-body {
  flex: 1;
  padding: 8px;
}
.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  padding-right: 8px;
  min-width: 0;
}
.node-folder {
  color: var(--doc-warning);
}
.node-doc {
  color: var(--doc-primary);
}
.tree-node-title {
  flex: 1;
  font-size: 13px;
}
.tree-node-actions {
  display: none;
  gap: 4px;
  color: var(--doc-text-secondary);
}
.tree-node-actions .el-icon {
  cursor: pointer;
}
.tree-node-actions .el-icon:hover {
  color: var(--doc-primary);
}
:deep(.el-tree-node__content:hover) .tree-node-actions {
  display: inline-flex;
}
</style>
