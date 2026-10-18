<script setup>
// 文档版本列表页（mock 数据）：查看 / 对比 / 恢复
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getDocVersionsApi, restoreVersionApi } from '@/api/docApi'
import { formatTime } from '@/utils/format'
import PageCard from '@/components/common/PageCard.vue'

const route = useRoute()
const router = useRouter()
const docId = route.params.docId

const loading = ref(false)
const versions = ref([])

/** 查看版本内容弹窗 */
const viewVisible = ref(false)
const viewVersion = ref({})

/** 对比：与上一版本（列表中的下一个）对比 */
function handleCompare(row, index) {
  const prev = versions.value[index + 1]
  const query = prev ? { from: row.versionId, to: prev.versionId } : {}
  router.push({ path: `/doc/compare/${docId}`, query })
}

/** 恢复到该版本 */
async function handleRestore(row) {
  await ElMessageBox.confirm(
    `确定恢复到版本 V${row.versionNo} 吗？当前内容将生成新版本。`,
    '恢复确认',
    { type: 'warning' }
  )
  await restoreVersionApi(docId, row.versionId)
  ElMessage.success(`已恢复到 V${row.versionNo}`)
}

onMounted(async () => {
  loading.value = true
  try {
    versions.value = await getDocVersionsApi(docId)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="page-container">
    <PageCard title="文档版本历史">
      <template #extra>
        <el-button @click="router.push(`/doc/edit/${docId}`)">返回编辑</el-button>
      </template>
      <el-table v-loading="loading" :data="versions" stripe>
        <el-table-column label="版本号" width="90" align="center">
          <template #default="{ row }">
            <el-tag>V{{ row.versionNo }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="修改说明" min-width="180" show-overflow-tooltip />
        <el-table-column prop="editorName" label="操作人" width="110" align="center" />
        <el-table-column label="更新时间" width="160" align="center">
          <template #default="{ row }">{{ formatTime(row.updateTime) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="{ row, $index }">
            <el-button link type="primary" @click="viewVersion = row; viewVisible = true">
              查看
            </el-button>
            <el-button link type="primary" :disabled="$index === versions.length - 1" @click="handleCompare(row, $index)">
              对比
            </el-button>
            <el-button link type="warning" @click="handleRestore(row)">恢复</el-button>
          </template>
        </el-table-column>
      </el-table>
    </PageCard>

    <!-- 版本内容预览 -->
    <el-dialog v-model="viewVisible" :title="`版本 V${viewVersion.versionNo} 内容预览`" width="720px">
      <div class="version-content" v-html="viewVersion.content" />
    </el-dialog>
  </div>
</template>

<style scoped>
.version-content {
  max-height: 60vh;
  overflow: auto;
  line-height: 1.8;
}
</style>
