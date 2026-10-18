<script setup>
// 版本对比组件：基于行级 diff 左右并排高亮差异（utils/diff 提供 LCS 算法）
import { computed } from 'vue'
import { diffLines, diffStat } from '@/utils/diff'

const props = defineProps({
  oldTitle: { type: String, default: '旧版本' },
  newTitle: { type: String, default: '新版本' },
  oldContent: { type: String, default: '' },
  newContent: { type: String, default: '' }
})

// 完整差异序列
const diffResult = computed(() => diffLines(props.oldContent, props.newContent))
// 变更统计
const stat = computed(() => diffStat(diffResult.value))
// 左侧展示：相同 + 删除；右侧展示：相同 + 新增
const oldLines = computed(() => diffResult.value.filter((l) => l.type !== 'add'))
const newLines = computed(() => diffResult.value.filter((l) => l.type !== 'del'))
</script>

<template>
  <div class="version-compare">
    <!-- 变更统计 -->
    <div class="compare-stat">
      <span class="stat-item stat-add">新增 {{ stat.added }} 行</span>
      <span class="stat-item stat-del">删除 {{ stat.deleted }} 行</span>
    </div>
    <!-- 左右对比面板 -->
    <div class="compare-panels">
      <div class="compare-panel">
        <div class="panel-title old-title">{{ props.oldTitle }}</div>
        <div class="panel-body">
          <div
            v-for="(line, idx) in oldLines"
            :key="'o' + idx"
            class="diff-line"
            :class="{ 'diff-del': line.type === 'del' }"
          >
            <pre>{{ line.text || ' ' }}</pre>
          </div>
        </div>
      </div>
      <div class="compare-panel">
        <div class="panel-title new-title">{{ props.newTitle }}</div>
        <div class="panel-body">
          <div
            v-for="(line, idx) in newLines"
            :key="'n' + idx"
            class="diff-line"
            :class="{ 'diff-add': line.type === 'add' }"
          >
            <pre>{{ line.text || ' ' }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.compare-stat {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}
.stat-item {
  font-size: 13px;
  padding: 2px 10px;
  border-radius: 4px;
}
.stat-add {
  color: var(--doc-success);
  background: #f0f9eb;
}
.stat-del {
  color: var(--doc-danger);
  background: #fef0f0;
}
.compare-panels {
  display: flex;
  gap: 12px;
}
.compare-panel {
  flex: 1;
  min-width: 0;
  border: 1px solid var(--doc-border);
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
}
.panel-title {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  border-bottom: 1px solid var(--doc-border);
}
.old-title {
  background: #fdf6ec;
  color: var(--doc-warning);
}
.new-title {
  background: #f0f9eb;
  color: var(--doc-success);
}
.panel-body {
  height: calc(100vh - 320px);
  overflow: auto;
}
.diff-line {
  border-bottom: 1px solid #fafafa;
}
.diff-line pre {
  margin: 0;
  padding: 2px 12px;
  font-family: Consolas, Monaco, monospace;
  font-size: 13px;
  line-height: 20px;
  white-space: pre-wrap;
  word-break: break-all;
}
.diff-add {
  background: #f0f9eb;
}
.diff-del {
  background: #fef0f0;
  text-decoration: line-through;
  color: var(--doc-danger);
}
</style>
