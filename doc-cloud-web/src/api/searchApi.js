import request from './request'

// ==================== Mock 数据（阶段5 脚手架预览用，业务阶段替换为真实接口） ====================

const mockResults = [
  {
    docId: '1111',
    title: 'SpringCloud Alibaba 入门',
    spaceType: 'PERSONAL',
    spaceName: '个人空间',
    creatorName: '云中君',
    updateTime: '2026-10-18 21:30:00',
    highlight:
      '...<em>SpringCloud</em> Alibaba 是阿里开源的微服务一站式解决方案，包含 Nacos、Sentinel、RocketMQ 等核心组件，配合 Spring Boot 3 快速构建云原生应用...'
  },
  {
    docId: '1202',
    title: '八股文整理：MySQL 索引',
    spaceType: 'PERSONAL',
    spaceName: '个人空间',
    creatorName: '云中君',
    updateTime: '2026-10-12 19:40:00',
    highlight:
      '...索引下推、覆盖索引与最左前缀原则是面试高频考点；在<em>SpringCloud</em> 微服务中分库分表后的查询路由设计...'
  },
  {
    docId: '2101',
    title: '前端架构演进方案',
    spaceType: 'TEAM',
    spaceName: '前端技术组',
    creatorName: '林深',
    updateTime: '2026-10-15 11:00:00',
    highlight:
      '...从单体应用演进到<em>SpringCloud</em> 微服务架构后，前后端协作模式与接口契约管理的调整方案...'
  }
]

function mockResponse(data, delay = 300) {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay))
}

// ==================== 接口定义 ====================

/**
 * 全文检索文档
 * TODO 业务阶段替换为：request.get('/search/docs', { params: { keyword, page, size } })
 * 后端由 RocketMQ 异步同步 doc_doc 到 ES，本接口走 doc-cloud-search-service
 */
export function searchDocsApi(params = {}) {
  // mock 阶段固定返回样例数据（含 <em> 高亮标签），业务阶段由 ES 高亮返回
  return mockResponse({
    total: mockResults.length,
    page: params.page || 1,
    size: params.size || 10,
    list: mockResults
  })
}
