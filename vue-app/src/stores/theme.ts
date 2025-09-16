import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  // 主题状态
  const isDark = ref(false)
  const isAnimationEnabled = ref(true)
  
  // 侧边栏状态
  const isSidebarOpen = ref(false)
  const isSidebarCollapsed = ref(false)
  
  // 动画状态
  const isMoneyRainActive = ref(true)
  
  // 计算属性
  const currentTheme = computed(() => isDark.value ? 'dark' : 'light')
  
  // 主题切换
  const toggleTheme = () => {
    isDark.value = !isDark.value
    updateThemeClass()
  }
  
  // 更新HTML类名
  const updateThemeClass = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  // 侧边栏控制
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }
  
  const collapseSidebar = () => {
    isSidebarCollapsed.value = true
  }
  
  const expandSidebar = () => {
    isSidebarCollapsed.value = false
  }
  
  // 动画控制
  const toggleMoneyRain = () => {
    isMoneyRainActive.value = !isMoneyRainActive.value
  }
  
  const toggleAnimation = () => {
    isAnimationEnabled.value = !isAnimationEnabled.value
  }
  
  // 初始化主题
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      isDark.value = true
    }
    
    updateThemeClass()
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        isDark.value = e.matches
        updateThemeClass()
      }
    })
  }
  
  // 保存主题设置
  const saveThemePreference = () => {
    localStorage.setItem('theme', currentTheme.value)
  }
  
  return {
    // 状态
    isDark,
    isAnimationEnabled,
    isSidebarOpen,
    isSidebarCollapsed,
    isMoneyRainActive,
    
    // 计算属性
    currentTheme,
    
    // 方法
    toggleTheme,
    toggleSidebar,
    collapseSidebar,
    expandSidebar,
    toggleMoneyRain,
    toggleAnimation,
    initTheme,
    saveThemePreference,
  }
})