import { defineStore } from 'pinia'
import { loginApi, getProfileApi, logoutApi } from '@/api/userApi'
import {
  getToken,
  setToken,
  removeToken,
  getUserInfo,
  setUserInfo,
  removeUserInfo
} from '@/utils/auth'

/**
 * 用户状态：登录凭证 + 用户信息
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken() || '',
    userInfo: getUserInfo() || null
  }),
  getters: {
    /** 是否已登录 */
    isLoggedIn: (state) => !!state.token,
    /** 昵称（未登录兜底） */
    nickname: (state) => state.userInfo?.nickname || state.userInfo?.username || '未登录'
  },
  actions: {
    /** 登录：成功后持久化凭证与用户信息 */
    async login(loginForm) {
      const data = await loginApi(loginForm)
      this.token = data.token
      this.userInfo = data.user
      setToken(data.token)
      setUserInfo(data.user)
      return data
    },
    /** 拉取并刷新用户信息 */
    async fetchProfile() {
      this.userInfo = await getProfileApi()
      setUserInfo(this.userInfo)
      return this.userInfo
    },
    /** 退出登录：清理本地状态 */
    async logout() {
      await logoutApi()
      this.token = ''
      this.userInfo = null
      removeToken()
      removeUserInfo()
    }
  }
})
