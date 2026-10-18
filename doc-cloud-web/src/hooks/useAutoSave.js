import { ref, onBeforeUnmount } from 'vue'

/**
 * 防抖自动保存：内容变更后 delay 毫秒内无新变更才触发保存
 * @param {Function} saveFn 实际保存函数，入参为当前数据，返回 Promise
 * @param {Number} delay 防抖延迟，默认 1000ms
 */
export function useAutoSave(saveFn, delay = 1000) {
  const saving = ref(false) // 保存中
  const dirty = ref(false) // 有未保存修改
  const lastSavedAt = ref('') // 最近保存时间
  let timer = null

  /** 内容变更时调用：重置防抖计时器 */
  function scheduleSave(data) {
    dirty.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => doSave(data), delay)
  }

  /** 立即保存（手动保存按钮/离开页面前调用） */
  async function saveNow(data) {
    if (timer) clearTimeout(timer)
    await doSave(data)
  }

  async function doSave(data) {
    saving.value = true
    try {
      await saveFn(data)
      dirty.value = false
      lastSavedAt.value = new Date().toLocaleTimeString()
    } finally {
      saving.value = false
    }
  }

  /** 取消未执行的保存（组件卸载前自动调用） */
  function stopAutoSave() {
    if (timer) clearTimeout(timer)
  }

  onBeforeUnmount(stopAutoSave)

  return { saving, dirty, lastSavedAt, scheduleSave, saveNow, stopAutoSave }
}
