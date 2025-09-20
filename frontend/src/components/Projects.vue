<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useSidebar } from '../composables/useSidebar'
import '../css/projects.css'

const { isSidebarOpen } = useSidebar()

// 项目数据
const projects = [
  {
    id: 1,
    title: 'hezhili.online',
    description: '一个现代化的个人网站项目，使用Vue.js构建，采用Matrix主题设计，包含项目展示、导航系统、个人简介、技术博客、个人项目集等功能模块，为开发者提供完整的在线展示平台',
    image: '🌐'
  },
  {
    id: 2,
    title: 'Twikk',
    description: '一个类 Twitter 的社交平台示例，支持发送短帖（推文）、评论、点赞和社区功能的演示项目，可以使用metamask钱包进行绑定或者登录',
    image: '📁'
  },
  {
    id: 3,
    title: '个人简介',
    description: '详细介绍个人背景、技术栈、职业经历、技能特长等信息，让访问者更好地了解我的专业能力和发展方向',
    image: '👤'
  },
  {
    id: 4,
    title: '技术博客',
    description: '分享技术学习心得、开发经验、行业洞察和技术趋势分析，记录编程旅程中的思考和收获',
    image: '📝'
  }
]

// 滚动相关状态
const scrollProgress = ref(0)
const headerOpacity = ref(1)
const cardVisibilities = ref([false, false, false, false]) // 每个卡片的显示状态

// 滚动监听函数
const handleScroll = () => {
  const scrollTop = window.pageYOffset
  const windowHeight = window.innerHeight

  // 计算滚动进度 (0-1)
  const progress = Math.min(scrollTop / (windowHeight * 0.5), 1)
  scrollProgress.value = progress

  // 标题透明度：从1渐变到0
  headerOpacity.value = Math.max(1 - progress * 2, 0)

  // 控制每个卡片的显示
  const triggerPoints = [0.4, 0.6, 0.8, 1.0] // 每个卡片开始显示的滚动进度

  projects.forEach((_, index) => {
    const cardTrigger = (scrollTop - windowHeight * 0.5) / (windowHeight * 0.5)
    if (cardTrigger > index * 0.2) {
      cardVisibilities.value[index] = true
    }
  })
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // 初始调用一次
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
    <div class="projects-page" :style="{ paddingLeft: isSidebarOpen ? '250px' : '90px' }">
        <!-- 项目网格区域 -->
        <div class="projects-grid">
            <!-- 50%高度的空div让标题居中显示 -->
            <div class="spacer"></div>
            
            <!-- 标题区域 -->
            <div class="projects-header" :style="{ opacity: headerOpacity }">
                <h1>项目</h1>
                <div class="scroll-hint" v-if="scrollProgress < 0.1">
                    <span>↓ 滑动查看项目</span>
                </div>
            </div>

            <!-- 标题和卡片之间的空div -->
            <div class="spacer-between"></div>

            <!-- 项目卡片 -->
            <div
                v-for="(project, index) in projects"
                :key="project.id"
                class="project-card"
                :class="{ visible: cardVisibilities[index] }"
                :style="{
                    transitionDelay: `${index * 0.2}s`
                }"
            >
                <div class="project-image">
                    {{ project.image }}
                </div>
                <div class="project-content">
                    <h3>{{ project.title }}</h3>
                    <p>{{ project.description }}</p>
                </div>
            </div>
        </div>
    </div>
</template>