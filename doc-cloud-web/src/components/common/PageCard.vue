<script setup>
// 通用页面卡片：标题 + 操作区（extra 插槽） + 内容
defineProps({
  title: { type: String, default: '' }
})
</script>

<template>
  <el-card shadow="never" class="page-card">
    <template #header>
      <div class="flex-between">
        <span class="page-card-title">{{ title }}</span>
        <slot name="extra" />
      </div>
    </template>
    <slot />
  </el-card>
</template>

<style scoped>
.page-card-title {
  font-weight: 600;
}
</style>
