<template>
  <div class="blog-page">
    <div class="console integrated">
      <div class="console-header">
        <div class="header-left">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
          <div class="title">hezhili@portfolio: ~/blog</div>
        </div>
        <div class="header-status">
          <span class="status-indicator"></span>
          <span>ONLINE</span>
        </div>
      </div>

      <!-- 启动序列 -->
      <div class="boot-sequence" v-if="!showContent">
        <div 
          v-for="(line, index) in terminalLines" 
          :key="index" 
          class="terminal-line"
          :class="{ 'success-line': line.type === 'success', 'info-line': line.type === 'info' }"
        >
          <span v-if="line.text" class="line-content">{{ line.text }}</span>
        </div>
        <span class="boot-cursor" v-if="!showContent">_</span>
      </div>

      <!-- 主内容 -->
      <transition name="content-fade">
        <div v-if="showContent" class="console-content">
          <div class="panel">
            <h2>技术博客</h2>
            <p>分享我的技术学习心得、开发经验和行业洞察。</p>
            
            <div class="blog-posts">
              <div v-if="loading" class="loading">加载中...</div>
              <div v-for="post in posts" :key="post._id || post.id" class="blog-post">
                <h3>{{ post.title }}</h3>
                <div class="post-meta">
                  <span class="post-date">{{ post.date }}</span>
                  <span class="post-tags">{{ post.tags.join(', ') }}</span>
                </div>
                <p class="post-excerpt">{{ post.excerpt }}</p>
                <button class="read-more-btn" @click="viewPost(post)">阅读更多</button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    
    <!-- toast container -->
    <div class="toast-container" v-if="toast">
      <div class="toast" :data-show="toastVisible">{{ toast }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import '../css/blog.css'

const emit = defineEmits(['navigate'])

// 终端启动动画
const terminalLines = ref([])
const showContent = ref(false)

const bootSequence = [
  { text: '> Connecting to blog server...', delay: 200 },
  { text: '[OK] Connection established', delay: 150, type: 'success' },
  { text: '> Fetching latest posts...', delay: 200 },
  { text: '[INFO] Parsing markdown content...', delay: 100, type: 'info' },
  { text: '[OK] Database synchronized', delay: 150, type: 'success' },
  { text: '', delay: 50 },
  { text: '╔═════════════════════════════════════════════╗', delay: 30 },
  { text: '║                                             ║', delay: 30 },
  { text: '║   █▄▄ █   █▀█ █▀▀   █▀ █▄█ █▀ ▀█▀ █▀▀ █▀▄▀█ ║', delay: 30 },
  { text: '║   █▄█ █▄▄ █▄█ █▄█   ▄█ ░█░ ▄█ ░█░ ██▄ █░▀░█ ║', delay: 30 },
  { text: '║                                             ║', delay: 30 },
  { text: '╚═════════════════════════════════════════════╝', delay: 30 },
  { text: '', delay: 100 },
  { text: '[OK] Ready to display content', delay: 150, type: 'success' },
]

const toast = ref(null)
const toastVisible = ref(false)

const showToast = (text, ms = 1400) => {
  toast.value = text
  toastVisible.value = true
  setTimeout(() => (toastVisible.value = false), ms)
}

const viewPost = (post) => {
  emit('navigate', { view: 'blog-detail', post })
}

const posts = ref([])
const loading = ref(true)

const fetchPosts = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/posts`)
    if (response.ok) {
      posts.value = await response.json()
      // Ensure posts are sorted by date descending (newest first)
      posts.value.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else {
      // Fallback to static data if API not available
      posts.value = [
        {
          _id: '1',
          title: '不好意思',
          date: '2099-13-32',
          tags: ['error', '404 Not Found', 'Fatal'],
          excerpt: '因为一些不可抗力的原因，博客内容暂时无法显示，请稍后再试。'
        }
      ]
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    // Fallback to static data
    posts.value = [
      {
        _id: '1',
        title: '没有成功连接上数据库',
        date: '8888-88-88',
        tags: ['error', 'database', 'Fatal'],
        excerpt: '请检查数据库连接是否正确，或者稍后再试。'
      }
    ]
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // 启动动画
  for (const line of bootSequence) {
    await new Promise(resolve => setTimeout(resolve, line.delay))
    terminalLines.value.push(line)
  }
  await new Promise(resolve => setTimeout(resolve, 300))
  showContent.value = true
  
  // 获取博客数据
  fetchPosts()
})
</script>

<style src="/src/css/blog.css"></style>