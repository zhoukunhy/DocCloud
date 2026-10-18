<script setup>
// 通用搜索输入框：回车或点击图标跳转全文检索页
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const keyword = ref('')

function onSearch() {
  const kw = keyword.value.trim()
  if (!kw) return
  router.push({ path: '/search', query: { kw } })
}
</script>

<template>
  <el-input
    v-model="keyword"
    placeholder="搜索文档..."
    clearable
    class="search-input"
    @keyup.enter="onSearch"
  >
    <template #prefix>
      <el-icon class="search-icon" @click="onSearch"><Search /></el-icon>
    </template>
  </el-input>
</template>

<style scoped>
.search-input {
  width: 240px;
}
.search-icon {
  cursor: pointer;
}
</style>
