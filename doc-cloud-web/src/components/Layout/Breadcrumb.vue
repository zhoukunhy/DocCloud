<script setup>
// 面包屑：由当前路由 matched 中带 meta.title 的节点生成
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const items = computed(() =>
  route.matched.filter((r) => r.meta?.title).map((r) => ({ path: r.path, title: r.meta.title }))
)
</script>

<template>
  <el-breadcrumb separator="/" class="breadcrumb">
    <el-breadcrumb-item v-for="item in items" :key="item.path" :to="item.path">
      {{ item.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped>
.breadcrumb {
  line-height: 56px;
}
</style>
