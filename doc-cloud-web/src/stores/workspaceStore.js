import { defineStore } from 'pinia'
import { getDocTreeApi } from '@/api/docApi'

/**
 * 工作空间状态：个人/团队空间切换 + 文档目录树 + 侧边栏折叠
 */
export const useWorkspaceStore = defineStore('workspace', {
  state: () => ({
    // 当前空间类型：PERSONAL-个人空间 / TEAM-团队空间
    spaceType: 'PERSONAL',
    // 团队空间 ID（spaceType=TEAM 时有效）
    spaceId: '',
    // 文档目录树
    docTree: [],
    treeLoading: false,
    // 侧边栏折叠状态
    sidebarCollapsed: false
  }),
  getters: {
    /** 空间名称 */
    spaceLabel: (state) => (state.spaceType === 'PERSONAL' ? '个人空间' : '团队空间')
  },
  actions: {
    /** 加载当前空间文档目录树 */
    async loadDocTree() {
      this.treeLoading = true
      try {
        this.docTree = await getDocTreeApi(this.spaceType, this.spaceId)
      } finally {
        this.treeLoading = false
      }
    },
    /** 切换空间并刷新目录树 */
    async switchSpace(spaceType, spaceId = '') {
      this.spaceType = spaceType
      this.spaceId = spaceId
      await this.loadDocTree()
    },
    /** 切换侧边栏折叠 */
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    }
  }
})
