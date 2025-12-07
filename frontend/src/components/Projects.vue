<script setup>
import { ref } from 'vue'
import { useSidebar } from '../composables/useSidebar'
import '../css/projects.css'

const { isSidebarOpen } = useSidebar()

const emit = defineEmits(['navigate'])

const toast = ref(null)
const toastVisible = ref(false)

const showToast = (text, ms = 1400) => {
  toast.value = text
  toastVisible.value = true
  try { window.__lastNavigate = text } catch(e){}
  setTimeout(() => (toastVisible.value = false), ms)
}

const handleCardClick = (project) => {
  console.log('handleCardClick called for', project.title, 'url:', project.url, 'isExternal:', isExternal(project.url))
  if (isExternal(project.url)) {
    window.open(project.url, '_blank')
  } else {
    emit('navigate', projectInternalKey(project.url))
  }
}

const isExternal = (url) => {
  if (!url) return false
  return url.startsWith('http')
}

const projectInternalKey = (url) => {
  // map internal paths to view keys used in App.vue
  if (!url) return 'home'
  if (url === '/' ) return 'home'
  if (url.startsWith('/about')) return 'profile'
  if (url.startsWith('/blog')) return 'blog'
  return 'home'
}

// 项目数据
const projects = [
  {
    id: 1,
    title: 'hezhili.online',
    description: '一个现代化的个人网站项目，使用Vue.js构建，采用Matrix主题设计，包含项目展示、导航系统、个人简介、技术博客、个人项目集等功能模块，为开发者提供完整的在线展示平台',
    url: '/',
    image: '🌐'
  },
  {
    id: 2,
    title: 'Twikk',
    description: '一个类 Twitter 的社交平台示例，支持发送短帖（推文）、评论、点赞和社区功能的演示项目，可以使用 metamask 钱包进行绑定或登录',
    url: 'https://twikk.hezhili.online',
    image: '📁'
  },
  {
    id: 6,
    title: 'Buffotte',
    description: 'BUFF市场AI风控与策略分析工具，提供实时市场数据分析、风险评估报告和投资策略建议',
    url: 'https://buffotte.hezhili.online/',
    image: '📊'
  },
  {
    id: 7,
    title: 'Bufftracker',
    description: 'BUFF市场数据跟踪与分析平台，提供实时价格监控、市场趋势分析和投资组合管理工具',
    url: 'https://bufftracker.hezhili.online/',
    image: '📈'
  },
  {
    id: 3,
    title: '个人简介',
    description: '详细介绍个人背景、技术栈、职业经历、技能特长等信息，让访问者更好地了解我的专业能力和发展方向',
    url: '/about',
    image: '👤'
  },
  {
    id: 4,
    title: '技术博客',
    description: '分享技术学习心得、开发经验、行业洞察和技术趋势分析，记录编程旅程中的思考和收获',
    url: '/blog',
    image: '📝'
  }
]
</script>

<template>
    <div class="projects-page" :style="{ paddingLeft: isSidebarOpen ? '250px' : '90px' }">
        <!-- 项目网格 -->
        <div class="projects-grid">
            <div
                v-for="project in projects"
                :key="project.id"
                class="project-card project-link"
                @click="handleCardClick(project)"
            >
                <div class="project-image">{{ project.image }}</div>
                <div class="project-content">
                    <h3>{{ project.title }}</h3>
                    <p>{{ project.description }}</p>
                </div>
            </div>
        </div>
    </div>
    <!-- toast container -->
    <div class="toast-container" v-if="toast">
      <div class="toast" :data-show="toastVisible">{{ toast }}</div>
    </div>
</template>