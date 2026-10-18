<script setup>
// 消息中心：全部/未读/已读 Tab + 标记已读（mock 数据，角标联动 messageStore）
import { computed, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getMessageListApi, markReadApi, markAllReadApi } from '@/api/messageApi'
import { useMessageStore } from '@/stores/messageStore'
import PageCard from '@/components/common/PageCard.vue'
import { formatRelativeTime } from '@/utils/format'

const messageStore = useMessageStore()

const loading = ref(false)
const messages = ref([])
// 当前 Tab：all-全部 / unread-未读 / read-已读
const activeTab = ref('all')

const tabMessages = computed(() => {
  if (activeTab.value === 'unread') return messages.value.filter((m) => !m.isRead)
  if (activeTab.value === 'read') return messages.value.filter((m) => m.isRead)
  return messages.value
})

/** 消息类型图标与颜色 */
const typeIcon = { SHARE: 'Share', TEAM: 'User', DOC: 'Document', SYSTEM: 'Bell' }
const typeColor = { SHARE: 'var(--doc-primary)', TEAM: 'var(--doc-success)', DOC: 'var(--doc-warning)', SYSTEM: 'var(--doc-text-secondary)' }

/** 标记单条已读 */
async function handleMarkRead(msg) {
  if (msg.isRead) return
  await markReadApi(msg.id)
  msg.isRead = true
  messageStore.decreaseUnread()
  ElMessage.success('已标记为已读')
}

/** 全部标记已读 */
async function handleMarkAll() {
  await markAllReadApi()
  messages.value.forEach((m) => (m.isRead = true))
  messageStore.unreadCount = 0
  ElMessage.success('已全部标记为已读')
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await getMessageListApi()
    messages.value = res.list
    await messageStore.fetchUnreadCount()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="page-container">
    <PageCard title="消息中心">
      <template #extra>
        <el-button :disabled="messageStore.unreadCount === 0" @click="handleMarkAll">
          全部标记已读
        </el-button>
      </template>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane :label="`未读（${messageStore.unreadCount}）`" name="unread" />
        <el-tab-pane label="已读" name="read" />
      </el-tabs>
      <div v-loading="loading" class="message-list">
        <div
          v-for="msg in tabMessages"
          :key="msg.id"
          class="message-item"
          :class="{ unread: !msg.isRead }"
          @click="handleMarkRead(msg)"
        >
          <el-icon :size="20" :color="typeColor[msg.type]"><component :is="typeIcon[msg.type] || 'Bell'" /></el-icon>
          <div class="message-body">
            <div class="message-title">
              <span :class="{ 'msg-unread-title': !msg.isRead }">{{ msg.title }}</span>
              <span v-if="!msg.isRead" class="unread-dot" />
            </div>
            <div class="message-content text-secondary">{{ msg.content }}</div>
          </div>
          <span class="message-time text-secondary">{{ formatRelativeTime(msg.createTime) }}</span>
        </div>
        <el-empty v-if="!loading && tabMessages.length === 0" description="暂无消息" :image-size="90" />
      </div>
    </PageCard>
  </div>
</template>

<style scoped>
.message-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 8px;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
}
.message-item:hover {
  background: #f5f7fa;
}
.message-body {
  flex: 1;
  min-width: 0;
}
.message-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}
.msg-unread-title {
  font-weight: 600;
}
.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--doc-danger);
  flex-shrink: 0;
}
.message-content {
  font-size: 13px;
  margin-top: 4px;
}
.message-time {
  font-size: 12px;
  white-space: nowrap;
}
</style>
