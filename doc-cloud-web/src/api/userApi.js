import request from './request'

// ==================== Mock 数据（阶段5 脚手架预览用，业务阶段替换为真实接口） ====================

const mockUser = {
  id: '1',
  username: 'doccloud',
  nickname: '云中君',
  email: 'doccloud@example.com',
  avatar: '',
  createTime: '2026-10-01 10:00:00'
}

const mockTeams = [
  {
    id: '101',
    name: '前端技术组',
    description: '前端架构与工程化交流，沉淀技术方案与周报',
    memberCount: 8,
    ownerName: '云中君',
    role: 'OWNER',
    createTime: '2026-10-02 09:30:00'
  },
  {
    id: '102',
    name: '产品文档组',
    description: '产品需求、设计文档与评审记录',
    memberCount: 12,
    ownerName: '林深',
    role: 'MEMBER',
    createTime: '2026-10-05 14:20:00'
  }
]

const mockMembers = [
  { userId: '1', username: 'doccloud', nickname: '云中君', role: 'OWNER', joinTime: '2026-10-02 09:30:00' },
  { userId: '2', username: 'linshen', nickname: '林深', role: 'ADMIN', joinTime: '2026-10-02 10:00:00' },
  { userId: '3', username: 'moran', nickname: '墨染', role: 'MEMBER', joinTime: '2026-10-03 16:45:00' }
]

/** 模拟接口延迟，让页面加载态可感知 */
function mockResponse(data, delay = 300) {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay))
}

// ==================== 接口定义 ====================

/**
 * 用户登录
 * TODO 业务阶段替换为：request.post('/user/auth/login', data)（经网关转发 user-service）
 */
export function loginApi(data) {
  return mockResponse({ token: 'mock-token-doc-cloud', user: { ...mockUser, username: data.username } })
}

/**
 * 用户注册
 * TODO 业务阶段替换为：request.post('/user/auth/register', data)
 */
export function registerApi(data) {
  return mockResponse({ id: '2', username: data.username })
}

/**
 * 获取当前登录用户信息
 * TODO 业务阶段替换为：request.get('/user/me')
 */
export function getProfileApi() {
  return mockResponse(mockUser)
}

/**
 * 更新个人资料
 * TODO 业务阶段替换为：request.put('/user/me', data)
 */
export function updateProfileApi(data) {
  return mockResponse({ ...mockUser, ...data })
}

/**
 * 修改密码
 * TODO 业务阶段替换为：request.put('/user/me/password', data)
 */
export function changePasswordApi() {
  return mockResponse(null)
}

/**
 * 我的团队列表
 * TODO 业务阶段替换为：request.get('/user/teams')
 */
export function getTeamListApi() {
  return mockResponse(mockTeams)
}

/**
 * 创建团队
 * TODO 业务阶段替换为：request.post('/user/teams', data)
 */
export function createTeamApi(data) {
  return mockResponse({
    id: '103',
    memberCount: 1,
    ownerName: mockUser.nickname,
    role: 'OWNER',
    createTime: '2026-10-18 22:00:00',
    ...data
  })
}

/**
 * 团队详情
 * TODO 业务阶段替换为：request.get(`/user/teams/${teamId}`)
 */
export function getTeamDetailApi(teamId) {
  const team = mockTeams.find((t) => t.id === teamId) || mockTeams[0]
  return mockResponse(team)
}

/**
 * 团队成员列表
 * TODO 业务阶段替换为：request.get(`/user/teams/${teamId}/members`)
 */
export function getTeamMembersApi() {
  return mockResponse(mockMembers)
}

/**
 * 退出登录（前端清理凭证即可，后端可选注销 token）
 */
export function logoutApi() {
  return mockResponse(null, 100)
}
