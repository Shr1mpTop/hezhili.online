<template>
  <div class="app">
    <MatrixBackground />
    <Sidebar @navigate="handleNavigate" />
    <main class="main-content">
      <!-- 主页内容 -->
      <div v-if="currentView === 'home'">
        <pre class="home-ascii">
 █████                          █████       ███  ████   ███                               ████   ███                     
░░███                          ░░███       ░░░  ░░███  ░░░                               ░░███  ░░░                      
 ░███████    ██████   █████████ ░███████   ████  ░███  ████            ██████  ████████   ░███  ████  ████████    ██████ 
 ░███░░███  ███░░███ ░█░░░░███  ░███░░███ ░░███  ░███ ░░███           ███░░███░░███░░███  ░███ ░░███ ░░███░░███  ███░░███
 ░███ ░███ ░███████  ░   ███░   ░███ ░███  ░███  ░███  ░███          ░███ ░███ ░███ ░███  ░███  ░███  ░███ ░███ ░███████ 
 ░███ ░███ ░███░░░     ███░   █ ░███ ░███  ░███  ░███  ░███          ░███ ░███ ░███ ░███  ░███  ░███  ░███ ░███ ░███░░░  
 ████ █████░░██████   █████████ ████ █████ █████ █████ █████    ██   ░░██████  ████ █████ █████ █████ ████ █████░░██████ 
░░░░ ░░░░░  ░░░░░░   ░░░░░░░░░ ░░░░ ░░░░░ ░░░░░ ░░░░░ ░░░░░    ░░     ░░░░░░  ░░░░ ░░░░░ ░░░░░ ░░░░░ ░░░░ ░░░░░  ░░░░░░  
                                                                                                                         
                                                                                                                         
                                                                                                                         </pre>
      </div>

  <!-- 项目页面 -->
  <Projects v-else-if="currentView === 'projects'" @navigate="handleNavigate" />

      <!-- Buffotte 报告 -->
      <BuffotteReport v-else-if="currentView === 'buffotte'" />

      <!-- 个人简介页面 -->
      <About v-else-if="currentView === 'profile'" />

      <!-- 技术博客页面 -->
      <Blog v-else-if="currentView === 'blog'" @navigate="handleNavigate" />

      <!-- 博客详情页面 -->
      <PostDetail v-else-if="currentView === 'blog-detail'" :post="selectedPost" @navigate="handleNavigate" />

      <!-- 联系页面 -->
      <div v-else-if="currentView === 'contact'">
        <h1>Audentes fortuna iuvat</h1>
        <h2>"命运眷顾勇敢之人"</h2>
      </div>
    </main>
  </div>
</template>

<script>
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Button from './components/Button.vue'
import MatrixBackground from './components/MatrixBackground.vue'
import Projects from './components/Projects.vue'
import BuffotteReport from './components/BuffotteReport.vue'
import About from './components/About.vue'
import Blog from './components/Blog.vue'
import PostDetail from './components/PostDetail.vue'
import './css/app.css'

export default {
  components: {
    Sidebar,
    Button,
    MatrixBackground,
    Projects,
    BuffotteReport,
    About,
    Blog,
    PostDetail
  },
  setup() {
    const currentView = ref('home')
    const selectedPost = ref(null)

    const handleNavigate = (view) => {
      console.log('导航到:', view)
      if (typeof view === 'object' && view.view) {
        currentView.value = view.view
        selectedPost.value = view.post
      } else {
        currentView.value = view
        selectedPost.value = null
      }
      console.log('currentView set to:', currentView.value)
    }

    return {
      currentView,
      selectedPost,
      handleNavigate
    }
  }
}
</script>
