<script setup>
import { ref } from 'vue'
import { useSidebar } from '../composables/useSidebar'
import '../css/contact.css'

const { isSidebarOpen } = useSidebar()

const feedback = ref('')
const email = ref('')
const isAnonymous = ref(true)
const isLoading = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const errorMessage = ref('')

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3002'

const toggleAnonymous = () => {
  isAnonymous.value = !isAnonymous.value
  if (isAnonymous.value) {
    email.value = ''
  }
}

const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

const sendFeedback = async () => {
  // 验证
  if (!feedback.value.trim()) {
    errorMessage.value = '请输入反馈内容'
    showError.value = true
    setTimeout(() => showError.value = false, 3000)
    return
  }
  
  if (!isAnonymous.value && email.value && !validateEmail(email.value)) {
    errorMessage.value = '请输入有效的邮箱地址'
    showError.value = true
    setTimeout(() => showError.value = false, 3000)
    return
  }
  
  isLoading.value = true
  showError.value = false
  
  try {
    const response = await fetch(`${API_BASE}/api/contact/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feedback: feedback.value.trim(),
        email: isAnonymous.value ? null : email.value.trim()
      })
    })
    
    const result = await response.json()
    
    if (result.success) {
      showSuccess.value = true
      feedback.value = ''
      email.value = ''
      isAnonymous.value = true
      setTimeout(() => showSuccess.value = false, 5000)
    } else {
      errorMessage.value = result.error || '发送失败，请稍后再试'
      showError.value = true
      setTimeout(() => showError.value = false, 3000)
    }
  } catch (error) {
    console.error('发送反馈失败:', error)
    errorMessage.value = '网络错误，请检查连接后重试'
    showError.value = true
    setTimeout(() => showError.value = false, 3000)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="contact-page" :style="{ paddingLeft: isSidebarOpen ? '250px' : '90px' }">
    <!-- 标题区域 -->
    <div class="contact-header">
      <h1 class="contact-title">Audentes fortuna iuvat</h1>
      <h2 class="contact-subtitle">"命运眷顾勇敢之人"</h2>
    </div>
    
    <!-- 联系表单区域 -->
    <div class="feedback-container">
      <div class="feedback-card">
        <div class="card-header">
          <span class="card-icon">📬</span>
          <h3>联系作者</h3>
        </div>
        
        <p class="card-description">
          有任何建议、问题或想法？欢迎给我留言，我会认真阅读每一条反馈。
        </p>
        
        <!-- 反馈内容输入 -->
        <div class="form-group">
          <label for="feedback">您的反馈</label>
          <textarea 
            id="feedback"
            v-model="feedback"
            placeholder="请输入您想对作者说的话..."
            rows="6"
            :disabled="isLoading"
          ></textarea>
          <span class="char-count">{{ feedback.length }} / 5000</span>
        </div>
        
        <!-- 匿名开关 -->
        <div class="anonymous-toggle">
          <label class="toggle-container">
            <input 
              type="checkbox" 
              :checked="isAnonymous"
              @change="toggleAnonymous"
              :disabled="isLoading"
            />
            <span class="toggle-slider"></span>
          </label>
          <span class="toggle-label">{{ isAnonymous ? '匿名发送' : '留下邮箱' }}</span>
        </div>
        
        <!-- 邮箱输入（非匿名时显示） -->
        <transition name="slide">
          <div v-if="!isAnonymous" class="form-group email-group">
            <label for="email">您的邮箱</label>
            <input 
              id="email"
              type="email"
              v-model="email"
              placeholder="example@email.com"
              :disabled="isLoading"
            />
            <span class="email-hint">
              📧 提供邮箱后，您将收到一封确认邮件
            </span>
          </div>
        </transition>
        
        <!-- 发送按钮 -->
        <button 
          class="send-button"
          @click="sendFeedback"
          :disabled="isLoading || !feedback.trim()"
        >
          <span v-if="isLoading" class="loading-spinner"></span>
          <span v-else>{{ isLoading ? '发送中...' : '发送反馈' }}</span>
        </button>
        
        <!-- 成功提示 -->
        <transition name="fade">
          <div v-if="showSuccess" class="success-message">
            ✅ 反馈已成功发送，感谢您的意见！
          </div>
        </transition>
        
        <!-- 错误提示 -->
        <transition name="fade">
          <div v-if="showError" class="error-message">
            ❌ {{ errorMessage }}
          </div>
        </transition>
      </div>
      
      <!-- 其他联系方式 -->
      <div class="other-contacts">
        <h4>其他联系方式</h4>
        <div class="contact-links">
          <a href="https://github.com/Shr1mpTop" target="_blank" class="contact-link">
            <span class="link-icon">🐙</span>
            <span>GitHub</span>
          </a>
          <a href="mailto:HEZH0014@e.ntu.edu.sg" class="contact-link">
            <span class="link-icon">📧</span>
            <span>Email</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
