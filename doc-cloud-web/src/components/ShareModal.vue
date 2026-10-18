<script setup>
// 分享弹窗：生成/复制分享链接、设置有效期、取消分享
import { ref, watch } from 'vue'
import { useShare } from '@/hooks/useShare'

const props = defineProps({
  visible: { type: Boolean, default: false },
  docId: { type: String, default: '' },
  docTitle: { type: String, default: '' }
})
const emit = defineEmits(['update:visible'])

const { shareLoading, shareInfo, createShare, copyShareLink, cancelShare } = useShare()
// 分享有效期（天）
const expireDays = ref(7)

// 弹窗打开时自动生成分享链接（mock）
watch(
  () => props.visible,
  (val) => {
    if (val && props.docId) {
      createShare(props.docId, { expireDays: expireDays.value })
    }
  }
)

function onClose() {
  emit('update:visible', false)
}

async function onCopy() {
  await copyShareLink()
}

async function onCancelShare() {
  await cancelShare(props.docId)
  onClose()
}
</script>

<template>
  <el-dialog
    :model-value="visible"
    :title="`分享「${docTitle || '文档'}」`"
    width="520px"
    @close="onClose"
  >
    <div v-loading="shareLoading" class="share-body">
      <el-form label-width="80px">
        <el-form-item label="有效期">
          <el-radio-group v-model="expireDays">
            <el-radio :value="1">1 天</el-radio>
            <el-radio :value="7">7 天</el-radio>
            <el-radio :value="30">30 天</el-radio>
            <el-radio :value="0">永久</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="分享链接">
          <el-input :model-value="shareInfo?.shareUrl" readonly placeholder="生成中...">
            <template #append>
              <el-button type="primary" @click="onCopy">复制</el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-alert
        title="任何人通过链接即可在线阅读该文档，取消分享后链接立即失效。"
        type="info"
        :closable="false"
      />
    </div>
    <template #footer>
      <el-button @click="onCancelShare">取消分享</el-button>
      <el-button type="primary" @click="onClose">完成</el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.share-body {
  min-height: 120px;
}
</style>
