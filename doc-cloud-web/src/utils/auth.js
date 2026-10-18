/**
 * 登录凭证与用户信息本地存储工具
 * localStorage Key 统一加 doc_cloud_ 前缀
 */
const TOKEN_KEY = 'doc_cloud_token'
const USER_KEY = 'doc_cloud_user'

/** 获取 token */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || ''
}

/** 保存 token */
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

/** 移除 token */
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}

/** 获取本地缓存的用户信息 */
export function getUserInfo() {
  const raw = localStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

/** 缓存用户信息 */
export function setUserInfo(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

/** 清除用户信息 */
export function removeUserInfo() {
  localStorage.removeItem(USER_KEY)
}
