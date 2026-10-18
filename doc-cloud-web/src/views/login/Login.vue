<script setup>
// 登录页（免登录白名单路由）
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/userStore'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const formRef = ref()
// 默认填充演示账号，便于脚手架预览
const form = reactive({ username: 'doccloud', password: '123456' })
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

/** 登录（mock）：成功后按 redirect 回跳或进入工作台 */
async function handleLogin() {
  await formRef.value.validate()
  loading.value = true
  try {
    await userStore.login(form)
    ElMessage.success('登录成功')
    router.push(route.query.redirect || '/workspace')
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
        <h1 class="auth-title">DocCloud 文档云</h1>
        <p class="auth-subtitle text-secondary">轻量在线文档协作平台</p>
      </div>
      <el-form ref="formRef" :model="form" :rules="rules" size="large">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="密码"
            show-password
            prefix-icon="Lock"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            :loading="loading"
            size="large"
            @click="handleLogin"
          >
            登 录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="auth-footer text-secondary">
        还没有账号？<router-link to="/register" class="auth-link">立即注册</router-link>
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
.login-btn {
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
