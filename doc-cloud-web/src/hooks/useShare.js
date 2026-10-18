import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { createShareApi, cancelShareApi } from '@/api/docApi'

/**
 * 文档分享逻辑复用：生成分享链接、复制、取消分享
 */
export function useShare() {
  const shareLoading = ref(false)
  // 分享信息：{ shareId, shareUrl, expireDays }
  const shareInfo = ref(null)

  /** 创建分享链接 */
  async function createShare(docId, options = {}) {
    shareLoading.value = true
    try {
      shareInfo.value = await createShareApi(docId, options)
      return shareInfo.value
    } finally {
      shareLoading.value = false
    }
  }

  /** 复制分享链接到剪贴板 */
  async function copyShareLink() {
    if (!shareInfo.value?.shareUrl) {
      ElMessage.warning('请先生成分享链接')
      return
    }
    await navigator.clipboard.writeText(shareInfo.value.shareUrl)
    ElMessage.success('分享链接已复制')
  }

  /** 取消分享 */
  async function cancelShare(docId) {
    await cancelShareApi(docId)
    shareInfo.value = null
    ElMessage.success('已取消分享')
  }

  return { shareLoading, shareInfo, createShare, copyShareLink, cancelShare }
}
