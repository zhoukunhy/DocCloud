import request from './request'

// ==================== Mock 数据（阶段5 脚手架预览用，业务阶段替换为真实接口） ====================

const mockDocTree = [
  {
    id: '1001',
    parentId: '0',
    title: '个人笔记',
    nodeType: 'folder',
    children: [
      {
        id: '1101',
        parentId: '1001',
        title: 'Java 微服务笔记',
        nodeType: 'folder',
        children: [
          { id: '1111', parentId: '1101', title: 'SpringCloud Alibaba 入门', nodeType: 'doc' },
          { id: '1112', parentId: '1101', title: 'Nacos 注册中心踩坑记录', nodeType: 'doc' }
        ]
      },
      { id: '1102', parentId: '1001', title: '前端学习路线', nodeType: 'doc' }
    ]
  },
  {
    id: '1002',
    parentId: '0',
    title: '面试专项',
    nodeType: 'folder',
    children: [
      { id: '1201', parentId: '1002', title: '八股文整理：JVM', nodeType: 'doc' },
      { id: '1202', parentId: '1002', title: '八股文整理：MySQL 索引', nodeType: 'doc' }
    ]
  },
  { id: '1003', parentId: '0', title: '读书笔记：深入理解计算机系统', nodeType: 'doc' }
]

const mockDocDetail = {
  id: '1111',
  title: 'SpringCloud Alibaba 入门',
  spaceType: 'PERSONAL',
  parentId: '1101',
  content:
    '<h1>SpringCloud Alibaba 入门</h1><p>这是<strong>富文本编辑器</strong>的 mock 内容，用于阶段5脚手架预览。</p><ul><li>注册中心：Nacos</li><li>网关：Spring Cloud Gateway</li><li>熔断限流：Sentinel</li></ul><blockquote>业务阶段将对接 doc-cloud-doc-service 真实接口。</blockquote>',
  creatorName: '云中君',
  createTime: '2026-10-10 09:00:00',
  updateTime: '2026-10-18 21:30:00'
}

const mockVersions = [
  {
    versionId: 'v3',
    docId: '1111',
    versionNo: 3,
    content: mockDocDetail.content,
    editorName: '云中君',
    updateTime: '2026-10-18 21:30:00',
    remark: '补充 Sentinel 熔断限流章节'
  },
  {
    versionId: 'v2',
    docId: '1111',
    versionNo: 2,
    content: '<h1>SpringCloud Alibaba 入门</h1><p>旧版本：仅包含注册中心与网关两章。</p><ul><li>注册中心：Nacos</li><li>网关：Spring Cloud Gateway</li></ul>',
    editorName: '云中君',
    updateTime: '2026-10-15 20:10:00',
    remark: '调整目录结构'
  },
  {
    versionId: 'v1',
    docId: '1111',
    versionNo: 1,
    content: '<h1>SpringCloud Alibaba 入门</h1><p>初始版本，待补充。</p>',
    editorName: '林深',
    updateTime: '2026-10-10 09:00:00',
    remark: '创建文档'
  }
]

function mockResponse(data, delay = 300) {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay))
}

// ==================== 接口定义 ====================

/**
 * 获取文档目录树
 * @param {String} spaceType PERSONAL-个人空间 / TEAM-团队空间
 * @param {String} spaceId   团队空间 ID（spaceType=TEAM 时必传）
 * TODO 业务阶段替换为：request.get('/doc/tree', { params: { spaceType, spaceId } })
 */
export function getDocTreeApi(spaceType = 'PERSONAL', spaceId = '') {
  return mockResponse(mockDocTree)
}

/**
 * 创建文档/文件夹
 * TODO 业务阶段替换为：request.post('/doc/docs', data)
 */
export function createDocApi(data) {
  return mockResponse({ id: `d${Date.now()}`, nodeType: 'doc', children: [], ...data })
}

/**
 * 文档详情
 * TODO 业务阶段替换为：request.get(`/doc/docs/${docId}`)
 */
export function getDocDetailApi(docId) {
  return mockResponse({ ...mockDocDetail, id: docId })
}

/**
 * 保存文档内容（编辑器自动保存）
 * TODO 业务阶段替换为：request.put(`/doc/docs/${docId}/content`, data)
 * 业务阶段后端需校验 Redis 编辑互斥锁，锁非本人返回 423
 */
export function saveDocApi(docId, data) {
  return mockResponse({ id: docId, updateTime: '2026-10-18 22:00:00' }, 200)
}

/**
 * 重命名文档
 * TODO 业务阶段替换为：request.put(`/doc/docs/${docId}/title`, data)
 */
export function renameDocApi(docId, title) {
  return mockResponse({ id: docId, title })
}

/**
 * 删除文档（逻辑删除）
 * TODO 业务阶段替换为：request.delete(`/doc/docs/${docId}`)
 */
export function deleteDocApi() {
  return mockResponse(null)
}

/**
 * 文档版本列表
 * TODO 业务阶段替换为：request.get(`/doc/docs/${docId}/versions`)
 */
export function getDocVersionsApi(docId) {
  return mockResponse(mockVersions)
}

/**
 * 恢复到指定版本
 * TODO 业务阶段替换为：request.put(`/doc/docs/${docId}/versions/${versionId}/restore`)
 */
export function restoreVersionApi(docId, versionId) {
  return mockResponse(null)
}

/**
 * 创建分享链接
 * TODO 业务阶段替换为：request.post(`/doc/docs/${docId}/share`, data)
 */
export function createShareApi(docId, data = {}) {
  const shareId = `mock-share-${Date.now()}`
  return mockResponse({
    shareId,
    shareUrl: `${location.origin}/share/${shareId}`,
    expireDays: data.expireDays ?? 7
  })
}

/**
 * 取消分享
 * TODO 业务阶段替换为：request.delete(`/doc/docs/${docId}/share`)
 */
export function cancelShareApi() {
  return mockResponse(null)
}
