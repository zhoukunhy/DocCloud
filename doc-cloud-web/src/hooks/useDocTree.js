import { ref } from 'vue'
import { getDocTreeApi, createDocApi, renameDocApi, deleteDocApi } from '@/api/docApi'

/**
 * 文档目录树逻辑复用：加载、新建、重命名、删除
 * @param {String} spaceType PERSONAL-个人空间 / TEAM-团队空间
 * @param {String} spaceId   团队空间 ID
 */
export function useDocTree(spaceType = 'PERSONAL', spaceId = '') {
  const treeData = ref([])
  const loading = ref(false)

  /** 加载目录树 */
  async function loadTree() {
    loading.value = true
    try {
      treeData.value = await getDocTreeApi(spaceType, spaceId)
    } finally {
      loading.value = false
    }
  }

  /** 新建文档/文件夹，成功后刷新树 */
  async function addNode(parentId, title, nodeType = 'doc') {
    const node = await createDocApi({ parentId, title, nodeType, spaceType, spaceId })
    await loadTree()
    return node
  }

  /** 重命名节点，成功后刷新树 */
  async function renameNode(nodeId, title) {
    await renameDocApi(nodeId, title)
    await loadTree()
  }

  /** 删除节点，成功后刷新树 */
  async function removeNode(nodeId) {
    await deleteDocApi(nodeId)
    await loadTree()
  }

  return { treeData, loading, loadTree, addNode, renameNode, removeNode }
}
