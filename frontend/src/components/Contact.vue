<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
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
const terminalLines = ref([])
const showForm = ref(false)

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002'

// 终端启动动画
const bootSequence = [
  { text: '> Booting secure terminal...', delay: 200 },
  { text: '> Loading kernel modules...', delay: 150 },
  { text: '[OK] Core modules loaded', delay: 100, type: 'success' },
  { text: '> Initializing network interface...', delay: 200 },
  { text: '[OK] Network online (IPv4/IPv6)', delay: 100, type: 'success' },
  { text: '> Establishing secure channel...', delay: 300 },
  { text: '[OK] TLS 1.3 handshake complete', delay: 100, type: 'success' },
  { text: '[OK] Certificate verified: hezhili.online', delay: 100, type: 'success' },
  { text: '> Authenticating connection...', delay: 200 },
  { text: '[OK] Firewall rules applied', delay: 100, type: 'success' },
  { text: '[OK] Intrusion detection: ACTIVE', delay: 100, type: 'success' },
  { text: '> Loading user interface...', delay: 150 },
  { text: '[OK] UI components mounted', delay: 100, type: 'success' },
  { text: '', delay: 100 },
  { text: '════════════════════════════════════════════════════════════', delay: 50 },
  { text: '  Welcome, visitor. You have accessed the feedback terminal.', delay: 200 },
  { text: '  All transmissions are encrypted end-to-end.', delay: 150 },
  { text: '════════════════════════════════════════════════════════════', delay: 50 },
  { text: '', delay: 100 },
  { text: '[READY] Terminal online - awaiting input...', delay: 200, type: 'success' },
]

// ASCII艺术标题
const asciiArt = ` ██████╗ ██████╗ ███╗   ██╗████████╗ █████╗  ██████╗████████╗
██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔════╝╚══██╔══╝
██║     ██║   ██║██╔██╗ ██║   ██║   ███████║██║        ██║   
██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██║██║        ██║   
╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╗   ██║   
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝   ╚═╝   
            ███╗   ███╗███████╗
            ████╗ ████║██╔════╝
            ██╔████╔██║█████╗  
            ██║╚██╔╝██║██╔══╝  
            ██║ ╚═╝ ██║███████╗
            ╚═╝     ╚═╝╚══════╝`

const showAscii = ref(false)
const glitchActive = ref(false)
let glitchInterval = null

const startGlitch = () => {
  glitchInterval = setInterval(() => {
    glitchActive.value = true
    setTimeout(() => {
      glitchActive.value = false
    }, 100)
  }, 4000 + Math.random() * 3000)
}

onMounted(async () => {
  for (const line of bootSequence) {
    await new Promise(resolve => setTimeout(resolve, line.delay))
    terminalLines.value.push(line)
  }
  // 显示ASCII艺术
  await new Promise(resolve => setTimeout(resolve, 300))
  showAscii.value = true
  
  // 显示表单
  await new Promise(resolve => setTimeout(resolve, 500))
  showForm.value = true
  
  // 启动glitch效果
  await new Promise(resolve => setTimeout(resolve, 500))
  startGlitch()
})

onUnmounted(() => {
  if (glitchInterval) clearInterval(glitchInterval)
})

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
  if (!feedback.value.trim()) {
    errorMessage.value = 'ERROR: Message buffer is empty'
    showError.value = true
    setTimeout(() => showError.value = false, 3000)
    return
  }
  
  if (!isAnonymous.value && email.value && !validateEmail(email.value)) {
    errorMessage.value = 'ERROR: Invalid email format detected'
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
      errorMessage.value = result.error || 'TRANSMISSION_FAILED: Retry later'
      showError.value = true
      setTimeout(() => showError.value = false, 3000)
    }
  } catch (error) {
    console.error('发送反馈失败:', error)
    errorMessage.value = 'CONNECTION_ERROR: Network unreachable'
    showError.value = true
    setTimeout(() => showError.value = false, 3000)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="contact-page" :style="{ paddingLeft: isSidebarOpen ? '250px' : '90px' }">
    <!-- 终端容器 -->
    <div class="terminal-container">
      <!-- 终端头部 -->
      <div class="terminal-header">
        <div class="terminal-buttons">
          <span class="term-btn close"></span>
          <span class="term-btn minimize"></span>
          <span class="term-btn maximize"></span>
        </div>
        <div class="terminal-title">visitor@hezhili.online: ~/contact</div>
        <div class="terminal-status">
          <span class="status-dot"></span>
          <span>SECURE</span>
        </div>
      </div>

      <!-- 终端内容 -->
      <div class="terminal-body">
        <!-- 启动序列 -->
        <div class="boot-sequence">
          <div 
            v-for="(line, index) in terminalLines" 
            :key="index" 
            class="terminal-line"
            :class="{ 'success-line': line.type === 'success' }"
            v-show="line.text"
          >
            <span class="line-content">{{ line.text }}</span>
          </div>
        </div>

        <!-- ASCII 艺术标题 -->
        <transition name="ascii-fade">
          <div v-if="showAscii" class="ascii-section" :class="{ 'glitch': glitchActive }">
            <pre class="ascii-art">{{ asciiArt }}</pre>
          </div>
        </transition>

        <!-- 表单区域 -->
        <transition name="terminal-fade">
          <div v-if="showForm" class="form-section">
            <!-- 座右铭 -->
            <div class="motto-section">
              <div class="motto-text">"Audentes fortuna iuvat"</div>
              <div class="motto-translation">// 命运眷顾勇敢之人</div>
            </div>

            <!-- 消息输入 -->
            <div class="input-group">
              <div class="input-label">
                <span class="prompt">visitor@hezhili:~$</span>
                <span class="command">nano message.txt</span>
              </div>
              <textarea 
                v-model="feedback"
                class="terminal-textarea"
                placeholder="Enter your message here..."
                rows="6"
                :disabled="isLoading"
              ></textarea>
              <div class="input-footer">
                <span class="char-indicator">{{ feedback.length }}/5000 bytes</span>
              </div>
            </div>

            <!-- 身份选择 -->
            <div class="identity-section">
              <div class="input-label">
                <span class="prompt">visitor@hezhili:~$</span>
                <span class="command">set IDENTITY_MODE</span>
              </div>
              <div class="identity-toggle">
                <button 
                  :class="['mode-btn', { active: isAnonymous }]"
                  @click="isAnonymous = true; email = ''"
                  :disabled="isLoading"
                >
                  <span class="mode-icon">👤</span>
                  <span>匿名发送</span>
                </button>
                <button 
                  :class="['mode-btn', { active: !isAnonymous }]"
                  @click="isAnonymous = false"
                  :disabled="isLoading"
                >
                  <span class="mode-icon">📧</span>
                  <span>留下邮箱</span>
                </button>
              </div>
            </div>

            <!-- 邮箱输入 -->
            <transition name="slide-down">
              <div v-if="!isAnonymous" class="email-section">
                <div class="input-label">
                  <span class="prompt">visitor@hezhili:~$</span>
                  <span class="command">export EMAIL=</span>
                </div>
                <input 
                  type="email"
                  v-model="email"
                  class="terminal-input"
                  placeholder="your@email.com"
                  :disabled="isLoading"
                />
                <div class="email-note">
                  <span class="note-icon">ℹ️</span>
                  <span>You will receive an ACK confirmation upon transmission</span>
                </div>
              </div>
            </transition>

            <!-- 发送按钮 -->
            <div class="submit-section">
              <div class="input-label">
                <span class="prompt">visitor@hezhili:~$</span>
                <span class="command">./transmit.sh</span>
              </div>
              <button 
                class="transmit-btn"
                @click="sendFeedback"
                :disabled="isLoading || !feedback.trim()"
              >
                <span v-if="isLoading" class="loading-animation">
                  <span class="dot"></span>
                  <span class="dot"></span>
                  <span class="dot"></span>
                </span>
                <span v-else class="btn-content">
                  <span class="btn-icon">⚡</span>
                  <span>发送反馈</span>
                </span>
              </button>
            </div>

            <!-- 状态消息 -->
            <transition name="fade">
              <div v-if="showSuccess" class="status-message success">
                <span class="status-prefix">[SUCCESS]</span>
                <span>Transmission complete. Thank you for your feedback.</span>
              </div>
            </transition>

            <transition name="fade">
              <div v-if="showError" class="status-message error">
                <span class="status-prefix">[ERROR]</span>
                <span>{{ errorMessage }}</span>
              </div>
            </transition>

            <!-- 其他链接 -->
            <div class="links-section">
              <div class="section-divider">
                <span>───────────── OTHER CHANNELS ─────────────</span>
              </div>
              <div class="link-buttons">
                <a href="https://github.com/Shr1mpTop" target="_blank" class="link-btn">
                  <span class="link-icon">⌘</span>
                  <span>github.com/Shr1mpTop</span>
                </a>
                <a href="mailto:HEZH0014@e.ntu.edu.sg" class="link-btn">
                  <span class="link-icon">@</span>
                  <span>HEZH0014@e.ntu.edu.sg</span>
                </a>
              </div>
            </div>

            <!-- 终端光标 -->
            <div class="cursor-line">
              <span class="prompt">visitor@hezhili:~$</span>
              <span class="cursor"></span>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
