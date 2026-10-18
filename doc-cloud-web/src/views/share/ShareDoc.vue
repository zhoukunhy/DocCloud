<script setup>
// 访客分享文档页：免登录路由，独立布局（mock 数据渲染）
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getDocDetailApi } from '@/api/docApi'
import { formatTime } from '@/utils/format'

const route = useRoute()
const shareId = route.params.shareId

const loading = ref(true)
// mock：分享失效状态（业务阶段由后端校验 shareId 有效性决定）
const expired = ref(false)
const doc = ref({ title: '', content: '', creatorName: '', updateTime: '' })

onMounted(async () => {
  try {
    doc.value = await getDocDetailApi(shareId)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div v-loading="loading" class="share-page">
    <!-- 顶部极简导航 -->
    <header class="share-header">
      <div class="share-logo">
        <el-icon color="var(--doc-primary)" :size="20"><Reading /></el-icon>
        <span>DocCloud 文档云</span>
      </div>
      <el-button size="small" type="primary" plain @click="$router.push('/login')">登录 / 注册</el-button>
    </header>
    <!-- 分享失效态 -->
    <div v-if="expired" class="share-main">
      <el-empty description="分享链接已失效或被取消分享" :image-size="120" />
    </div>
    <!-- 文档内容 -->
    <main v-else class="share-main">
      <div class="share-doc-card">
        <h1 class="share-doc-title">{{ doc.title }}</h1>
        <div class="share-doc-meta text-secondary">
          {{ doc.creatorName }} · 分享于 {{ formatTime(doc.updateTime) }}
        </div>
        <el-divider />
        <div class="share-doc-content" v-html="doc.content" />
      </div>
      <footer class="share-footer text-secondary">该页面为只读分享，内容提供方：DocCloud 文档云</footer>
    </main>
  </div>
</template>

<style scoped>
.share-page {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--doc-bg);
}
.share-header {
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid var(--doc-border);
}
.share-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}
.share-main {
  flex: 1;
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  padding: 24px 16px;
}
.share-doc-card {
  background: #fff;
  border-radius: 8px;
  padding: 32px 40px;
  min-height: 400px;
}
.share-doc-title {
  margin: 0 0 8px;
  font-size: 24px;
}
.share-doc-meta {
  font-size: 13px;
}
.share-doc-content {
  line-height: 1.9;
}
.share-footer {
  text-align: center;
  padding: 20px 0;
  font-size: 12px;
}
</style>
