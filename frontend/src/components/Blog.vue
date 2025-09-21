<template>
  <div class="blog-page">
    <div class="console integrated">
      <div class="console-header">
        <span class="console-prompt">hezhili@portfolio: ~/blog</span>
        <span class="console-cursor">_</span>
      </div>
      <div class="console-content">
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
    </div>
    
    <!-- toast container -->
    <div class="toast-container" v-if="toast">
      <div class="toast" :data-show="toastVisible">{{ toast }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['navigate'])

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
    const response = await fetch('http://localhost:3000/api/posts')
    if (response.ok) {
      posts.value = await response.json()
    } else {
      // Fallback to static data if API not available
      posts.value = [
        {
          _id: '1',
          title: 'Vue 3 Composition API 最佳实践',
          date: '2024-09-15',
          tags: ['Vue.js', '前端开发', 'Composition API'],
          excerpt: '探索Vue 3 Composition API的核心概念和最佳实践，包括响应式数据管理、生命周期钩子、以及如何构建可复用的组合函数。'
        },
        {
          _id: '2',
          title: 'Python异步编程：从asyncio到并发优化',
          date: '2024-09-10',
          tags: ['Python', '异步编程', '并发'],
          excerpt: '深入了解Python的asyncio模块，学习如何编写高效的异步代码，以及在实际项目中应用并发优化技术。'
        },
        {
          _id: '3',
          title: 'Docker容器化部署实践指南',
          date: '2024-09-05',
          tags: ['Docker', '容器化', 'DevOps'],
          excerpt: '从零开始学习Docker容器化技术，包括镜像构建、多容器编排、以及在生产环境中部署应用的完整流程。'
        },
        {
          _id: '4',
          title: '机器学习模型部署到Web应用',
          date: '2024-08-30',
          tags: ['机器学习', 'Web开发', 'Flask'],
          excerpt: '将训练好的机器学习模型集成到Web应用中，实现模型推理API和用户友好的界面设计。'
        }
      ]
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    // Fallback to static data
    posts.value = [
      {
        _id: '1',
        title: 'Vue 3 Composition API 最佳实践',
        date: '2024-09-15',
        tags: ['Vue.js', '前端开发', 'Composition API'],
        excerpt: '探索Vue 3 Composition API的核心概念和最佳实践，包括响应式数据管理、生命周期钩子、以及如何构建可复用的组合函数。'
      },
      {
        _id: '2',
        title: 'Python异步编程：从asyncio到并发优化',
        date: '2024-09-10',
        tags: ['Python', '异步编程', '并发'],
        excerpt: '深入了解Python的asyncio模块，学习如何编写高效的异步代码，以及在实际项目中应用并发优化技术。'
      },
      {
        _id: '3',
        title: 'Docker容器化部署实践指南',
        date: '2024-09-05',
        tags: ['Docker', '容器化', 'DevOps'],
        excerpt: '从零开始学习Docker容器化技术，包括镜像构建、多容器编排、以及在生产环境中部署应用的完整流程。'
      },
      {
        _id: '4',
        title: '机器学习模型部署到Web应用',
        date: '2024-08-30',
        tags: ['机器学习', 'Web开发', 'Flask'],
        excerpt: '将训练好的机器学习模型集成到Web应用中，实现模型推理API和用户友好的界面设计。'
      }
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPosts()
})
</script>

<style src="/src/css/blog.css"></style>