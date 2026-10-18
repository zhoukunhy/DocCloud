<script setup>
// 文件上传组件（阶段5 mock 上传）
// 业务阶段将 http-request 内的 uploadFileApi 换成 file-service 真实接口（MinIO）
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadFileApi } from '@/api/fileApi'
import { formatFileSize } from '@/utils/format'

const props = defineProps({
  // 接受的文件类型，如 .png,.pdf
  accept: { type: String, default: '' },
  // 最大上传数量
  limit: { type: Number, default: 5 }
})

const emit = defineEmits(['success'])

const uploading = ref(false)
// 已上传文件列表
const fileList = ref([])

/** 自定义上传（mock：本地生成预览地址） */
async function handleUpload(options) {
  uploading.value = true
  try {
    const res = await uploadFileApi(options.file)
    fileList.value.push(res)
    ElMessage.success(`「${res.fileName}」上传成功`)
    emit('success', res)
  } finally {
    uploading.value = false
  }
}

/** 移除文件（仅前端移除，mock 阶段不调后端） */
function handleRemove(file) {
  fileList.value = fileList.value.filter((f) => f.id !== file.id)
}
</script>

<template>
  <div v-loading="uploading" class="file-upload">
    <el-upload
      drag
      multiple
      :accept="accept"
      :limit="limit"
      :auto-upload="true"
      :show-file-list="false"
      :http-request="handleUpload"
    >
      <el-icon class="el-icon--upload" :size="40"><UploadFilled /></el-icon>
      <div class="el-upload__text">拖拽文件到此处，或 <em>点击上传</em></div>
    </el-upload>
    <!-- 已上传文件列表 -->
    <ul v-if="fileList.length" class="upload-list">
      <li v-for="file in fileList" :key="file.id" class="upload-item">
        <el-icon><Document /></el-icon>
        <span class="file-name text-ellipsis">{{ file.fileName }}</span>
        <span class="file-size text-secondary">{{ formatFileSize(file.fileSize) }}</span>
        <el-icon class="file-remove" title="移除" @click="handleRemove(file)"><Close /></el-icon>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.upload-list {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
}
.upload-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--doc-border);
  border-radius: 4px;
  margin-bottom: 8px;
  background: #fff;
}
.file-name {
  flex: 1;
}
.file-size {
  font-size: 12px;
}
.file-remove {
  cursor: pointer;
  color: var(--doc-text-secondary);
}
.file-remove:hover {
  color: var(--doc-danger);
}
</style>
