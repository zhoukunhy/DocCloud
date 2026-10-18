<script setup>
// 团队空间页：团队信息头 + 团队文档目录树 + 成员列表（mock 数据）
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getTeamDetailApi, getTeamMembersApi } from '@/api/userApi'
import { getDocTreeApi } from '@/api/docApi'
import { useDocTree } from '@/hooks/useDocTree'
import DocTree from '@/components/DocTree/index.vue'
import PageCard from '@/components/common/PageCard.vue'
import { formatTime } from '@/utils/format'

const route = useRoute()
const teamId = route.params.teamId

const team = ref({})
const members = ref([])

// 团队文档目录树（mock）
const { treeData, loading, loadTree, addNode, renameNode, removeNode } = useDocTree('TEAM', teamId)

/** 角色标签映射 */
const roleMap = { OWNER: '创建者', ADMIN: '管理员', MEMBER: '成员' }
const roleTagType = { OWNER: 'warning', ADMIN: 'success', MEMBER: 'info' }

onMounted(async () => {
  loadTree()
  team.value = await getTeamDetailApi(teamId)
  members.value = await getTeamMembersApi(teamId)
})
</script>

<template>
  <div class="page-container">
    <!-- 团队信息头 -->
    <el-card shadow="never" class="team-head-card">
      <div class="team-head flex">
        <el-avatar :size="52" class="team-avatar">{{ team.name?.slice(0, 1) || '队' }}</el-avatar>
        <div class="team-head-info">
          <div class="team-head-name">
            {{ team.name }}
            <el-tag :type="roleTagType[team.role] || 'info'" size="small" style="margin-left: 8px">
              {{ roleMap[team.role] || '成员' }}
            </el-tag>
          </div>
          <div class="text-secondary" style="font-size: 13px; margin-top: 6px">
            {{ team.description }} · 共 {{ team.memberCount }} 名成员
          </div>
        </div>
      </div>
    </el-card>

    <div class="flex" style="gap: 16px; align-items: flex-start">
      <!-- 团队文档树 -->
      <div class="team-docs">
        <DocTree
          :tree-data="treeData"
          :loading="loading"
          @node-click="(node) => $router.push(`/doc/edit/${node.id}`)"
          @create-doc="(parentId) => addNode(parentId, '未命名文档', 'doc')"
          @rename-doc="renameNode"
          @delete-doc="removeNode"
        />
      </div>
      <!-- 成员列表 -->
      <div class="team-members">
        <PageCard title="成员列表">
          <el-table :data="members" stripe>
            <el-table-column label="成员" min-width="140">
              <template #default="{ row }">
                <div class="flex" style="gap: 8px">
                  <el-avatar :size="28" class="member-avatar">{{ row.nickname.slice(0, 1) }}</el-avatar>
                  <span>{{ row.nickname }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="username" label="用户名" min-width="110" />
            <el-table-column label="角色" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="roleTagType[row.role]" size="small">{{ roleMap[row.role] }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="加入时间" width="160" align="center">
              <template #default="{ row }">{{ formatTime(row.joinTime) }}</template>
            </el-table-column>
          </el-table>
        </PageCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.team-head-card {
  margin-bottom: 16px;
}
.team-avatar {
  background: var(--doc-primary);
  color: #fff;
  font-size: 20px;
  flex-shrink: 0;
}
.team-head-info {
  margin-left: 14px;
}
.team-head-name {
  font-size: 18px;
  font-weight: 600;
}
.team-docs {
  width: 320px;
  height: calc(100vh - 320px);
  flex-shrink: 0;
  border: 1px solid var(--doc-border);
  border-radius: 4px;
  overflow: hidden;
}
.team-members {
  flex: 1;
  min-width: 0;
}
.member-avatar {
  background: var(--doc-primary);
  color: #fff;
  font-size: 13px;
}
</style>
