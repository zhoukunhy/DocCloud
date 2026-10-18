import request from './request'

// ==================== Mock 数据（阶段5 脚手架预览用，业务阶段替换为真实接口） ====================

const mockFiles = [
  { id: 'f1', fileName: '系统架构图.png', fileSize: 258048, fileType: 'image/png', uploadTime: '2026-10-16 15:20:00', url: '' },
  { id: 'f2', fileName: '面试简历.pdf', fileSize: 1048576, fileType: 'application/pdf', uploadTime: '2026-10-17 10:05:00', url: '' }
]

function mockResponse(data, delay = 300) {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay))
}

// ==================== 接口定义 ====================

/**
 * 上传图片（编辑器粘贴/插入图片时触发）
 * TODO 业务阶段替换为 FormData 真实上传：request.post('/file/image', formData)
 * 返回结构必须包含 { url }，供 WangEditor 插入图片
 */
export function uploadImageApi(file) {
  return mockResponse({ url: URL.createObjectURL(file), fileName: file.name }, 400)
}

/**
 * 上传附件文件
 * TODO 业务阶段替换为：request.post('/file/upload', formData)
 * 后端对接 MinIO，返回对象元信息（objectName/url/size 等）
 */
export function uploadFileApi(file) {
  return mockResponse(
    {
      id: `f${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadTime: '2026-10-18 22:00:00',
      url: URL.createObjectURL(file)
    },
    600
  )
}

/**
 * 我的文件列表
 * TODO 业务阶段替换为：request.get('/file/files', { params })
 */
export function getFileListApi() {
  return mockResponse(mockFiles)
}

/**
 * 删除文件
 * TODO 业务阶段替换为：request.delete(`/file/files/${fileId}`)
 */
export function deleteFileApi() {
  return mockResponse(null)
}
