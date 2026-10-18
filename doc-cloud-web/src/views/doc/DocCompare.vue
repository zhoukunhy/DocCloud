<script setup>
// 版本对比页：选择两个版本，DocVersionCompare 行级高亮差异（mock 数据）
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getDocVersionsApi } from '@/api/docApi'
import DocVersionCompare from '@/components/DocVersionCompare.vue'
import PageCard from '@/components/common/PageCard.vue'

const route = useRoute()
const router = useRouter()
const docId = route.params.docId

const loading = ref(false)
const versions = ref([])
// 当前选中的对比版本（默认取路由 query，缺省取前两个版本）
const fromVersionId = ref('')
const toVersionId = ref('')

const fromVersion = computed(() => versions.value.find((v) => v.versionId === fromVersionId.value))
const toVersion = computed(() => versions.value.find((v) => v.versionId === toVersionId.value))

onMounted(async () => {
  loading.value = true
  try {
    versions.value = await getDocVersionsApi(docId)
    // 版本列表按新→旧排列
    fromVersionId.value = route.query.from || versions.value[0]?.versionId || ''
    toVersionId.value = route.query.to || versions.value[1]?.versionId || ''
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-loading="loading" class="page-container">
    <PageCard title="版本对比">
      <template #extra>
        <div class="compare-select flex">
          <el-select v-model="fromVersionId" placeholder="旧版本" style="width: 160px">
            <el-option
              v-for="v in versions"
              :key="v.versionId"
              :label="`V${v.versionNo}（${v.remark}）`"
              :value="v.versionId"
            />
          </el-select>
          <span class="compare-arrow">→</span>
          <el-select v-model="toVersionId" placeholder="新版本" style="width: 160px">
            <el-option
              v-for="v in versions"
              :key="v.versionId"
              :label="`V${v.versionNo}（${v.remark}）`"
              :value="v.versionId"
            />
          </el-select>
          <el-button style="margin-left: 12px" @click="router.push(`/doc/version/${docId}`)">
            返回版本列表
          </el-button>
        </div>
      </template>
      <DocVersionCompare
        :old-title="fromVersion ? `V${fromVersion.versionNo}（${fromVersion.editorName}）` : '旧版本'"
        :new-title="toVersion ? `V${toVersion.versionNo}（${toVersion.editorName}）` : '新版本'"
        :old-content="fromVersion?.content || ''"
        :new-content="toVersion?.content || ''"
      />
    </PageCard>
  </div>
</template>

<style scoped>
.compare-arrow {
  margin: 0 8px;
  color: var(--doc-text-secondary);
}
</style>
