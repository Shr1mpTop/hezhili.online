<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import '../css/home.css'

// 启动动画状态
const bootLines = ref([])
const showAscii = ref(false)
const showMotto = ref(false)
const showSubtitle = ref(false)
const glitchActive = ref(false)

// 打字机效果
const typedText = ref('')
const fullMotto = '"Audentes fortuna iuvat"'

// 终端启动序列
const bootSequence = [
  { text: '> BIOS POST check...', delay: 100 },
  { text: '[OK] CPU: Intel Core i9-13900K @ 5.8GHz', delay: 80, type: 'success' },
  { text: '[OK] RAM: 64GB DDR5-6400', delay: 60, type: 'success' },
  { text: '[OK] GPU: RTX 4090 24GB GDDR6X', delay: 60, type: 'success' },
  { text: '[OK] Storage: 2TB NVMe SSD', delay: 60, type: 'success' },
  { text: '> Initializing kernel...', delay: 100 },
  { text: '> Loading system modules...', delay: 80 },
  { text: '[OK] Network stack initialized', delay: 50, type: 'success' },
  { text: '[OK] Security protocols active', delay: 50, type: 'success' },
  { text: '[OK] Firewall enabled', delay: 50, type: 'success' },
  { text: '> Decrypting user profile...', delay: 120 },
  { text: '[OK] Identity verified: HE ZHILI', delay: 100, type: 'success' },
  { text: '[OK] Permissions granted: ADMIN', delay: 80, type: 'success' },
  { text: '', delay: 50 },
  { text: '> Launching portfolio interface...', delay: 150 },
  { text: '[READY] System online', delay: 100, type: 'success' },
]

// 随机字符用于glitch效果
const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZあいうえおカキクケコ'

// 获取随机glitch字符
const getGlitchChar = () => glitchChars[Math.floor(Math.random() * glitchChars.length)]

// Glitch 效果
let glitchInterval = null
const startGlitch = () => {
  glitchInterval = setInterval(() => {
    glitchActive.value = Math.random() > 0.7
    setTimeout(() => glitchActive.value = false, 50 + Math.random() * 100)
  }, 2000 + Math.random() * 3000)
}

// 打字机效果
const typeWriter = async (text, targetRef) => {
  for (let i = 0; i <= text.length; i++) {
    targetRef.value = text.slice(0, i)
    await new Promise(r => setTimeout(r, 60 + Math.random() * 40))
  }
}

onMounted(async () => {
  // 运行启动序列
  for (const line of bootSequence) {
    await new Promise(r => setTimeout(r, line.delay))
    bootLines.value.push(line)
  }
  
  // 显示ASCII艺术
  await new Promise(r => setTimeout(r, 300))
  showAscii.value = true
  
  // 打字机效果显示座右铭
  await new Promise(r => setTimeout(r, 600))
  showMotto.value = true
  await typeWriter(fullMotto, typedText)
  
  // 显示翻译
  await new Promise(r => setTimeout(r, 400))
  showSubtitle.value = true
  
  // 启动glitch效果
  await new Promise(r => setTimeout(r, 500))
  startGlitch()
})

onUnmounted(() => {
  if (glitchInterval) clearInterval(glitchInterval)
})
</script>

<template>
  <div class="home-page">
    <!-- 终端容器 -->
    <div class="terminal-container">
      <!-- 终端头部 -->
      <div class="terminal-header">
        <div class="terminal-buttons">
          <span class="term-btn close"></span>
          <span class="term-btn minimize"></span>
          <span class="term-btn maximize"></span>
        </div>
        <div class="terminal-title">hezhili@portfolio: ~/welcome</div>
        <div class="terminal-status">
          <span class="status-dot"></span>
          <span>CONNECTED</span>
        </div>
      </div>

      <!-- 终端内容 -->
      <div class="terminal-body">
        <!-- 启动序列 -->
        <div class="boot-sequence">
          <div 
            v-for="(line, index) in bootLines" 
            :key="index" 
            class="boot-line"
            :class="{ 'success': line.type === 'success' }"
          >
            {{ line.text }}
          </div>
        </div>

        <!-- ASCII 艺术标题 -->
        <transition name="ascii-fade">
          <div v-if="showAscii" class="ascii-section" :class="{ 'glitch': glitchActive }">
            <pre class="ascii-art">
██╗  ██╗███████╗    ███████╗██╗  ██╗██╗██╗     ██╗
██║  ██║██╔════╝    ╚══███╔╝██║  ██║██║██║     ██║
███████║█████╗        ███╔╝ ███████║██║██║     ██║
██╔══██║██╔══╝       ███╔╝  ██╔══██║██║██║     ██║
██║  ██║███████╗    ███████╗██║  ██║██║███████╗██║
╚═╝  ╚═╝╚══════╝    ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚═╝
            </pre>
            <div class="ascii-subtitle">
              <span class="bracket">[</span>
              <span class="role">Full-Stack Developer</span>
              <span class="separator">|</span>
              <span class="role">AI Enthusiast</span>
              <span class="separator">|</span>
              <span class="role">Blockchain Explorer</span>
              <span class="bracket">]</span>
            </div>
          </div>
        </transition>

        <!-- 座右铭区域 -->
        <transition name="motto-fade">
          <div v-if="showMotto" class="motto-section">
            <div class="motto-container">
              <span class="motto-prompt">&gt;</span>
              <span class="motto-text">{{ typedText }}</span>
              <span class="cursor" :class="{ 'blink': typedText.length === fullMotto.length }">_</span>
            </div>
            <transition name="subtitle-fade">
              <div v-if="showSubtitle" class="motto-translation">
                <span class="comment-prefix">//</span>
                <span class="translation-text">命运眷顾勇敢之人</span>
              </div>
            </transition>
          </div>
        </transition>

        <!-- 装饰性代码块 -->
        <transition name="code-fade">
          <div v-if="showSubtitle" class="decorative-code">
            <div class="code-line">
              <span class="keyword">const</span> <span class="variable">developer</span> = <span class="brace">{</span>
            </div>
            <div class="code-line indent">
              <span class="property">name</span>: <span class="string">"He Zhili"</span>,
            </div>
            <div class="code-line indent">
              <span class="property">location</span>: <span class="string">"NTU, Singapore"</span>,
            </div>
            <div class="code-line indent">
              <span class="property">passion</span>: [<span class="string">"AI"</span>, <span class="string">"Web3"</span>, <span class="string">"Full-Stack"</span>],
            </div>
            <div class="code-line indent">
              <span class="property">status</span>: <span class="string">"Ready to innovate"</span>
            </div>
            <div class="code-line">
              <span class="brace">}</span>;
            </div>
          </div>
        </transition>

        <!-- 导航提示 -->
        <transition name="nav-fade">
          <div v-if="showSubtitle" class="nav-hint">
            <span class="hint-icon">◄</span>
            <span class="hint-text">Use sidebar to navigate</span>
            <span class="hint-icon">►</span>
          </div>
        </transition>
      </div>
    </div>

    <!-- 背景装饰 -->
    <div class="corner-decoration top-left">&lt;/&gt;</div>
    <div class="corner-decoration top-right">{ }</div>
    <div class="corner-decoration bottom-left">[ ]</div>
    <div class="corner-decoration bottom-right">( )</div>
  </div>
</template>
