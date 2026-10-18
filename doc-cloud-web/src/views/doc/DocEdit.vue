<script setup>
// 文档编辑核心页：WangEditor + 防抖自动保存 + 分享/版本入口（mock 数据）
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getDocDetailApi, saveDocApi } from '@/api/docApi'
import { useAutoSave } from '@/hooks/useAutoSave'
import DocEditor from '@/components/DocEditor/index.vue'
import ShareModal from '@/components/ShareModal.vue'

const route = useRoute()
const router = useRouter()
const docId = computed(() => route.params.docId)

const doc = ref({ id: '', title: '', content: '' })
const pageLoading = ref(true)
const shareVisible = ref(false)

// 防抖自动保存：1s 无新变更后触发
const { saving, dirty, lastSavedAt, scheduleSave, saveNow } = useAutoSave(async (data) => {
  await saveDocApi(data.id, { title: data.title, content: data.content })
})

// 顶部保存状态文案
const saveStatusText = computed(() => {
  if (saving.value) return '保存中...'
  if (dirty.value) return '有未保存修改'
  return lastSavedAt.value ? `已保存 ${lastSavedAt.value}` : ''
})

/** 标题/内容变更统一走防抖保存 */
function onChange() {
  scheduleSave(doc.value)
}

/** 手动保存 */
async function handleSave() {
  await saveNow(doc.value)
  ElMessage.success('保存成功')
}

onMounted(async () => {
  doc.value = await getDocDetailApi(docId.value)
  pageLoading.value = false
})
</script>

<template>
  <div v-loading="pageLoading" class="doc-edit page-container">
    <!-- 顶栏：标题 + 保存状态 + 操作 -->
    <div class="doc-edit-header">
      <el-input
        v-model="doc.title"
        class="doc-title-input"
        placeholder="无标题文档"
        @input="onChange"
      />
      <span class="save-status text-secondary">{{ saveStatusText }}</span>
      <div class="doc-actions">
        <el-button type="primary" :loading="saving" @click="handleSave">保存</el-button>
        <el-button @click="shareVisible = true">
          <el-icon><Share /></el-icon>分享
        </el-button>
        <el-button @click="router.push(`/doc/version/${docId}`)">
          <el-icon><Clock /></el-icon>历史版本
        </el-button>
      </div>
    </div>
    <!-- 富文本编辑器 -->
    <DocEditor v-model="doc.content" @update:model-value="onChange" />
    <!-- 分享弹窗 -->
    <ShareModal v-model:visible="shareVisible" :doc-id="docId" :doc-title="doc.title" />
  </div>
</template>

<style scoped>
.doc-edit-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
}
.doc-title-input {
  max-width: 420px;
}
.doc-title-input :deep(.el-input__inner) {
  font-size: 18px;
  font-weight: 600;
}
.save-status {
  font-size: 12px;
  white-space: nowrap;
}
.doc-actions {
  margin-left: auto;
  white-space: nowrap;
}
.doc-actions .el-button + .el-button {
  margin-left: 8px;
}
</style>
