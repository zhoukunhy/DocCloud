import { defineStore } from 'pinia'
import { getUnreadCountApi } from '@/api/messageApi'

/**
 * 消息状态：未读数（侧边栏角标联动）
 */
export const useMessageStore = defineStore('message', {
  state: () => ({
    unreadCount: 0
  }),
  actions: {
    /** 刷新未读消息数 */
    async fetchUnreadCount() {
      this.unreadCount = await getUnreadCountApi()
    },
    /** 本地扣减未读数（消息标记已读时同步角标） */
    decreaseUnread(count = 1) {
      this.unreadCount = Math.max(0, this.unreadCount - count)
    }
  }
})
