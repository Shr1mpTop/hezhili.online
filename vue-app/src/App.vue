<template>
  <div id="app" class="min-h-screen transition-colors duration-300">
    <!-- 背景图案 -->
    <BackgroundPattern />
    
    <!-- 钞票雨动画 -->
    <MoneyRain v-if="themeStore.isMoneyRainActive" />
    
    <!-- 侧边栏 -->
    <Sidebar />
    
    <!-- 主内容区 -->
    <main 
      class="transition-all duration-300"
      :class="{
        'ml-0 lg:ml-16': themeStore.isSidebarCollapsed,
        'ml-0 lg:ml-80': !themeStore.isSidebarCollapsed
      }"
    >
      <RouterView />
    </main>
    
    <!-- 控制按钮 -->
    <ControlButtons />
    
    <!-- 加载指示器 -->
    <LoadingIndicator v-if="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useThemeStore } from '@/stores/theme'

// 组件导入
import BackgroundPattern from '@/components/BackgroundPattern.vue'
import MoneyRain from '@/components/MoneyRain.vue'
import Sidebar from '@/components/Sidebar.vue'
import ControlButtons from '@/components/ControlButtons.vue'
import LoadingIndicator from '@/components/LoadingIndicator.vue'

// 状态管理
const themeStore = useThemeStore()
const isLoading = ref(true)

onMounted(() => {
  // 初始化主题
  themeStore.initTheme()
  
  // 模拟加载完成
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<style scoped>
#app {
  font-family: 'Inter', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
}
</style>