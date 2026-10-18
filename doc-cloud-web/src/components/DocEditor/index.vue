<script setup>
/**
 * WangEditor 富文本编辑器封装
 * 1. v-model 双向绑定 HTML 内容
 * 2. 预留图片粘贴/上传钩子（业务阶段对接 file-service 的 MinIO 上传接口）
 */
import '@wangeditor/editor/dist/css/style.css'
import { computed, onBeforeUnmount, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { uploadImageApi } from '@/api/fileApi'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '开始编写文档...' },
  readonly: { type: Boolean, default: false },
  height: { type: String, default: 'calc(100vh - 190px)' }
})

const emit = defineEmits(['update:modelValue'])

// 编辑器实例必须用 shallowRef，避免深度响应式带来的性能问题
const editorRef = shallowRef()
const mode = 'default'
// 工具栏配置（骨架阶段使用默认全量菜单）
const toolbarConfig = {}
// 编辑器配置
const editorConfig = {
  placeholder: props.placeholder,
  readOnly: props.readonly,
  MENU_CONF: {
    // 图片上传钩子（预留）：粘贴/选择图片时触发
    uploadImage: {
      async customUpload(file, insertFn) {
        const res = await uploadImageApi(file)
        // insertFn(url, alt, href)
        insertFn(res.url, file.name, res.url)
      }
    }
  }
}

// v-model 桥接
const valueHtml = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

function handleCreated(editor) {
  editorRef.value = editor
}

// 组件销毁时销毁编辑器实例
onBeforeUnmount(() => {
  editorRef.value?.destroy()
})
</script>

<template>
  <div class="doc-editor">
    <Toolbar
      class="editor-toolbar"
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"
    />
    <Editor
      v-model="valueHtml"
      class="editor-content"
      :style="{ height: props.height }"
      :default-config="editorConfig"
      :mode="mode"
      @on-created="handleCreated"
    />
  </div>
</template>

<style scoped>
.doc-editor {
  border: 1px solid var(--doc-border);
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  /* 保证工具栏下拉菜单、插入链接弹层不被页面其他元素遮挡 */
  z-index: 100;
}
.editor-toolbar {
  border-bottom: 1px solid var(--doc-border);
}
.editor-content {
  overflow-y: hidden;
}
</style>
