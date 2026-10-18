import request from './request'

// ==================== Mock 数据（阶段5 脚手架预览用，业务阶段替换为真实接口） ====================

const mockMessages = [
  { id: 'm1', type: 'SHARE', title: '林深 分享了文档《前端架构演进方案》', content: '点击查看分享详情', isRead: false, bizId: '2101', createTime: '2026-10-18 20:15:00' },
  { id: 'm2', type: 'TEAM', title: '您已加入团队「前端技术组」', content: '邀请人：云中君', isRead: false, bizId: '101', createTime: '2026-10-17 09:30:00' },
  { id: 'm3', type: 'DOC', title: '墨染 编辑了文档《Nacos 注册中心踩坑记录》', content: '文档内容有更新，点击查看', isRead: true, bizId: '1112', createTime: '2026-10-16 14:00:00' }
]

function mockResponse(data, delay = 300) {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay))
}

// ==================== 接口定义 ====================

/**
 * 消息列表（分页）
 * TODO 业务阶段替换为：request.get('/message/messages', { params: { isRead, page, size } })
 */
export function getMessageListApi(params = {}) {
  let list = mockMessages
  if (params.isRead === false) list = list.filter((m) => !m.isRead)
  if (params.isRead === true) list = list.filter((m) => m.isRead)
  return mockResponse({ total: list.length, list })
}

/**
 * 未读消息数（侧边栏角标）
 * TODO 业务阶段替换为：request.get('/message/messages/unread-count')
 */
export function getUnreadCountApi() {
  return mockResponse(mockMessages.filter((m) => !m.isRead).length, 100)
}

/**
 * 标记单条消息已读
 * TODO 业务阶段替换为：request.put(`/message/messages/${messageId}/read`)
 */
export function markReadApi(messageId) {
  const msg = mockMessages.find((m) => m.id === messageId)
  if (msg) msg.isRead = true
  return mockResponse(null, 100)
}

/**
 * 全部标记已读
 * TODO 业务阶段替换为：request.put('/message/messages/read-all')
 */
export function markAllReadApi() {
  mockMessages.forEach((m) => (m.isRead = true))
  return mockResponse(null, 100)
}
