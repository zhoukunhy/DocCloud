<script setup>
// 个人中心：基本资料 + 修改密码（mock 数据）
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { updateProfileApi, changePasswordApi } from '@/api/userApi'
import { useUserStore } from '@/stores/userStore'
import PageCard from '@/components/common/PageCard.vue'
import { formatTime } from '@/utils/format'

const userStore = useUserStore()
const saveLoading = ref(false)
const pwdLoading = ref(false)
const pwdFormRef = ref()

// 基本资料表单
const profileForm = reactive({
  nickname: '',
  email: '',
  avatar: ''
})
const userInfo = ref({})

async function handleSaveProfile() {
  if (!profileForm.nickname.trim()) {
    ElMessage.warning('昵称不能为空')
    return
  }
  saveLoading.value = true
  try {
    userInfo.value = await updateProfileApi(profileForm)
    await userStore.fetchProfile()
    ElMessage.success('资料保存成功')
  } finally {
    saveLoading.value = false
  }
}

// 修改密码表单
const pwdForm = reactive({ oldPassword: '', newPassword: '', confirmPassword: '' })
const validateConfirm = (rule, value, callback) => {
  if (value !== pwdForm.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}
const pwdRules = {
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' }
  ],
  confirmPassword: [{ validator: validateConfirm, trigger: 'blur' }]
}

async function handleChangePwd() {
  await pwdFormRef.value.validate()
  pwdLoading.value = true
  try {
    await changePasswordApi(pwdForm)
    ElMessage.success('密码修改成功，请重新登录')
    pwdForm.oldPassword = pwdForm.newPassword = pwdForm.confirmPassword = ''
  } finally {
    pwdLoading.value = false
  }
}

onMounted(async () => {
  userInfo.value = await userStore.fetchProfile()
  profileForm.nickname = userInfo.value.nickname
  profileForm.email = userInfo.value.email
  profileForm.avatar = userInfo.value.avatar
})
</script>

<template>
  <div class="page-container profile-page">
    <!-- 基本资料 -->
    <PageCard title="基本资料">
      <div class="profile-form">
        <div class="avatar-row">
          <el-avatar :size="64" class="profile-avatar">
            {{ profileForm.nickname?.slice(0, 1) || '云' }}
          </el-avatar>
          <div class="avatar-info">
            <div class="username text-secondary">用户名：{{ userInfo.username }}</div>
            <div class="text-secondary">注册时间：{{ formatTime(userInfo.createTime) }}</div>
          </div>
        </div>
        <el-form label-width="80px" style="max-width: 480px">
          <el-form-item label="昵称">
            <el-input v-model="profileForm.nickname" maxlength="20" placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="profileForm.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :loading="saveLoading" @click="handleSaveProfile">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </PageCard>
    <!-- 修改密码 -->
    <PageCard title="修改密码" style="margin-top: 16px">
      <el-form
        ref="pwdFormRef"
        :model="pwdForm"
        :rules="pwdRules"
        label-width="80px"
        style="max-width: 480px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input v-model="pwdForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="pwdForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="pwdForm.confirmPassword" type="password" show-password @keyup.enter="handleChangePwd" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="pwdLoading" @click="handleChangePwd">修改密码</el-button>
        </el-form-item>
      </el-form>
    </PageCard>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 900px;
}
.avatar-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.profile-avatar {
  background: var(--doc-primary);
  color: #fff;
  font-size: 24px;
}
.avatar-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
}
</style>
