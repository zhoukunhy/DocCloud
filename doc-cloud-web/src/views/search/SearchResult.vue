<script setup>
// 全文检索结果页：关键词搜索 + 高亮结果列表（mock 数据）
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { searchDocsApi } from '@/api/searchApi'
import PageCard from '@/components/common/PageCard.vue'
import { formatTime } from '@/utils/format'

const route = useRoute()
const router = useRouter()

const keyword = ref(route.query.kw || '')
const loading = ref(false)
const searched = ref(false)
const result = ref({ total: 0, list: [] })

/** 执行检索（mock 固定返回样例数据） */
async function doSearch() {
  const kw = keyword.value.trim()
  if (!kw) return
  loading.value = true
  try {
    result.value = await searchDocsApi({ keyword: kw })
    searched.value = true
    // 同步 URL，便于分享/回退
    router.replace({ path: '/search', query: { kw } })
  } finally {
    loading.value = false
  }
}

// 路由 query 变化（如从顶部搜索框再次发起）时重新检索
watch(
  () => route.query.kw,
  (kw) => {
    if (kw && kw !== keyword.value) {
      keyword.value = kw
      doSearch()
    }
  }
)

onMounted(() => {
  if (keyword.value) doSearch()
})
</script>

<template>
  <div class="page-container">
    <PageCard title="全文检索">
      <!-- 搜索框 -->
      <div class="search-bar">
        <el-input
          v-model="keyword"
          size="large"
          placeholder="输入关键词，检索所有有权访问的文档"
          clearable
          @keyup.enter="doSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" size="large" :loading="loading" @click="doSearch">搜索</el-button>
      </div>
      <!-- 结果统计 -->
      <div v-if="searched" class="result-stat text-secondary">
        找到 <b>{{ result.total }}</b> 篇与「{{ keyword }}」相关的文档
      </div>
      <!-- 结果列表 -->
      <div v-loading="loading" class="result-list">
        <div
          v-for="item in result.list"
          :key="item.docId"
          class="result-item"
          @click="router.push(`/doc/edit/${item.docId}`)"
        >
          <div class="result-title">{{ item.title }}</div>
          <!-- 后端返回的摘要含 <em> 高亮标签 -->
          <div class="result-highlight" v-html="item.highlight" />
          <div class="result-meta text-secondary">
            <el-tag size="small" :type="item.spaceType === 'TEAM' ? 'success' : 'info'">
              {{ item.spaceName }}
            </el-tag>
            <span>{{ item.creatorName }} · 更新于 {{ formatTime(item.updateTime) }}</span>
          </div>
        </div>
        <el-empty
          v-if="!loading && searched && result.list.length === 0"
          description="没有找到相关文档，换个关键词试试"
          :image-size="90"
        />
      </div>
    </PageCard>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  gap: 12px;
  max-width: 720px;
}
.search-bar .el-input {
  flex: 1;
}
.result-stat {
  margin: 16px 0 8px;
  font-size: 13px;
}
.result-item {
  padding: 14px 8px;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
}
.result-item:hover {
  background: #f5f7fa;
}
.result-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--doc-primary);
}
.result-highlight {
  font-size: 13px;
  margin: 6px 0;
  line-height: 1.7;
}
.result-highlight :deep(em) {
  color: var(--doc-danger);
  font-style: normal;
  font-weight: 600;
}
.result-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}
</style>
