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

      <!-- 个人简介页面 -->
      <About v-else-if="currentView === 'profile'" />

      <!-- 联系页面 -->
      <div v-else-if="currentView === 'contact'">
        <h1>联系我</h1>
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
import About from './components/About.vue'
import './css/app.css'

export default {
  components: {
    Sidebar,
    Button,
    MatrixBackground,
    Projects
    , About
  },
  setup() {
    const currentView = ref('home')

    const handleNavigate = (view) => {
      console.log('导航到:', view)
      currentView.value = view
    }

    return {
      currentView,
      handleNavigate
    }
  }
}
</script>
