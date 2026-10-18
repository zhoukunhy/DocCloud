/**
 * 通用格式化工具
 */

/** 格式化时间为 yyyy-MM-dd HH:mm */
export function formatTime(time) {
  if (!time) return '-'
  const d = new Date(time)
  if (Number.isNaN(d.getTime())) return String(time)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** 文件大小格式化（B/KB/MB/GB） */
export function formatFileSize(size) {
  if (size === null || size === undefined || size === '') return '-'
  const num = Number(size)
  if (Number.isNaN(num)) return '-'
  if (num < 1024) return `${num} B`
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`
  if (num < 1024 * 1024 * 1024) return `${(num / 1024 / 1024).toFixed(1)} MB`
  return `${(num / 1024 / 1024 / 1024).toFixed(2)} GB`
}

/** 相对时间：刚刚 / x分钟前 / x小时前 / x天前，超过 30 天显示具体日期 */
export function formatRelativeTime(time) {
  if (!time) return '-'
  const d = new Date(time).getTime()
  if (Number.isNaN(d)) return String(time)
  const diff = Date.now() - d
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  if (diff < minute) return '刚刚'
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`
  if (diff < 30 * day) return `${Math.floor(diff / day)} 天前`
  return formatTime(time)
}
