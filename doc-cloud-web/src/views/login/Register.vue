<script setup>
// 注册页（免登录白名单路由）
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { registerApi } from '@/api/userApi'

const router = useRouter()
const loading = ref(false)
const formRef = ref()
const form = reactive({ username: '', nickname: '', password: '', confirmPassword: '' })

// 确认密码校验
const validateConfirm = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' }
  ],
  confirmPassword: [{ validator: validateConfirm, trigger: 'blur' }]
}

/** 注册（mock）：成功后回登录页 */
async function handleRegister() {
  await formRef.value.validate()
  loading.value = true
  try {
    await registerApi(form)
    ElMessage.success('注册成功，请登录')
    router.push('/login')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <el-card class="auth-card">
      <div class="auth-logo">
        <el-icon :size="28" color="var(--doc-primary)"><Reading /></el-icon>
        <h1 class="auth-title">注册账号</h1>
        <p class="auth-subtitle text-secondary">加入 DocCloud，开始搭建你的知识库</p>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" size="large">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="nickname">
          <el-input v-model="form.nickname" placeholder="昵称" prefix-icon="Postcard" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" show-password prefix-icon="Lock" />
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            placeholder="确认密码"
            show-password
            prefix-icon="Lock"
            @keyup.enter="handleRegister"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="register-btn" :loading="loading" @click="handleRegister">
            注 册
          </el-button>
        </el-form-item>
      </el-form>
      <div class="auth-footer text-secondary">
        已有账号？<router-link to="/login" class="auth-link">去登录</router-link>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.auth-page {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0f0ff 0%, #f5f7fa 100%);
}
.auth-card {
  width: 400px;
  padding: 8px 12px;
}
.auth-logo {
  text-align: center;
  margin-bottom: 24px;
}
.auth-title {
  margin: 8px 0 4px;
  font-size: 22px;
}
.auth-subtitle {
  margin: 0;
  font-size: 13px;
}
.register-btn {
  width: 100%;
}
.auth-footer {
  text-align: center;
  font-size: 13px;
}
.auth-link {
  color: var(--doc-primary);
}
</style>
