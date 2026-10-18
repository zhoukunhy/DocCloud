<script setup>
// 团队列表页：团队卡片 + 创建团队弹窗（mock 数据）
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getTeamListApi, createTeamApi } from '@/api/userApi'
import PageCard from '@/components/common/PageCard.vue'

const router = useRouter()
const loading = ref(false)
const teams = ref([])

// 创建团队弹窗
const createVisible = ref(false)
const createLoading = ref(false)
const createForm = ref({ name: '', description: '' })

/** 创建团队（mock） */
async function handleCreate() {
  if (!createForm.value.name.trim()) {
    ElMessage.warning('请输入团队名称')
    return
  }
  createLoading.value = true
  try {
    const team = await createTeamApi(createForm.value)
    teams.value.unshift(team)
    createVisible.value = false
    createForm.value = { name: '', description: '' }
    ElMessage.success('团队创建成功')
  } finally {
    createLoading.value = false
  }
}

onMounted(async () => {
  loading.value = true
  try {
    teams.value = await getTeamListApi()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="page-container">
    <PageCard title="我的团队">
      <template #extra>
        <el-button type="primary" @click="createVisible = true">
          <el-icon><Plus /></el-icon>创建团队
        </el-button>
      </template>
      <div v-loading="loading" class="team-grid">
        <el-card v-for="team in teams" :key="team.id" shadow="hover" class="team-card">
          <div class="team-header">
            <el-avatar :size="44" class="team-avatar">{{ team.name.slice(0, 1) }}</el-avatar>
            <div class="team-info">
              <div class="team-name">{{ team.name }}</div>
              <div class="team-meta text-secondary">
                {{ team.memberCount }} 名成员 · 创建者：{{ team.ownerName }}
              </div>
            </div>
          </div>
          <p class="team-desc text-secondary text-ellipsis">{{ team.description }}</p>
          <div class="flex-between">
            <el-tag :type="team.role === 'OWNER' ? 'warning' : 'info'" size="small">
              {{ team.role === 'OWNER' ? '我创建的' : '已加入' }}
            </el-tag>
            <el-button type="primary" size="small" @click="router.push(`/team/detail/${team.id}`)">
              进入空间
            </el-button>
          </div>
        </el-card>
        <el-empty v-if="!loading && teams.length === 0" description="还没有团队，创建一个吧" />
      </div>
    </PageCard>

    <!-- 创建团队弹窗 -->
    <el-dialog v-model="createVisible" title="创建团队" width="460px">
      <el-form label-width="80px">
        <el-form-item label="团队名称" required>
          <el-input v-model="createForm.name" placeholder="如：前端技术组" maxlength="20" />
        </el-form-item>
        <el-form-item label="团队简介">
          <el-input
            v-model="createForm.description"
            type="textarea"
            :rows="3"
            placeholder="介绍一下这个团队的用途"
            maxlength="100"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" :loading="createLoading" @click="handleCreate">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  min-height: 200px;
}
.team-header {
  display: flex;
  gap: 12px;
  align-items: center;
}
.team-avatar {
  background: var(--doc-primary);
  color: #fff;
  font-size: 18px;
  flex-shrink: 0;
}
.team-name {
  font-size: 16px;
  font-weight: 600;
}
.team-meta {
  font-size: 12px;
  margin-top: 4px;
}
.team-desc {
  font-size: 13px;
  margin: 12px 0;
}
</style>
