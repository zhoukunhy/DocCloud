import axios from 'axios'
import { ElMessage } from 'element-plus'
import { getToken, removeToken, removeUserInfo } from '@/utils/auth'
import router from '@/router'

/** 后端统一返回码：与 doc-cloud-common ResultCode 对齐 */
const SUCCESS_CODE = 200
const UNAUTHORIZED_CODE = 401

/**
 * axios 统一封装
 * 1. 请求拦截器：自动携带 token（Authorization: Bearer xxx）
 * 2. 响应拦截器：统一解包 Result{code, message, data, timestamp}
 *    成功直接返回 data；失败统一 ElMessage 提示；401 清凭证跳登录
 */
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000
})

// 请求拦截器
request.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // 非 Result 结构（如文件流）直接透传
    if (res === null || typeof res !== 'object' || res.code === undefined) {
      return res
    }
    if (res.code === SUCCESS_CODE) {
      return res.data
    }
    if (res.code === UNAUTHORIZED_CODE) {
      handleUnauthorized()
      return Promise.reject(new Error(res.message || '登录已过期'))
    }
    ElMessage.error(res.message || '请求失败')
    return Promise.reject(new Error(res.message || '请求失败'))
  },
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      handleUnauthorized()
    } else {
      ElMessage.error(error.response?.data?.message || error.message || '网络异常，请稍后重试')
    }
    return Promise.reject(error)
  }
)

/** 未授权统一处理：清理本地凭证并回登录页 */
function handleUnauthorized() {
  removeToken()
  removeUserInfo()
  ElMessage.error('登录已过期，请重新登录')
  router.push({ path: '/login', query: { redirect: router.currentRoute.value.fullPath } })
}

export default request
