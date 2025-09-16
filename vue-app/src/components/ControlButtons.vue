<template>
  <div class="fixed top-4 right-4 z-40 flex flex-col gap-3">
    <!-- 钞票雨控制 -->
    <button
      @click="toggleMoneyRain"
      class="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center group"
      :title="themeStore.isMoneyRainActive ? '暂停钞票雨' : '开始钞票雨'"
    >
      <PlayIcon 
        v-if="!themeStore.isMoneyRainActive"
        class="w-5 h-5 text-primary-600 group-hover:text-primary-700"
      />
      <PauseIcon 
        v-else
        class="w-5 h-5 text-primary-600 group-hover:text-primary-700"
      />
    </button>
    
    <!-- 主题切换 -->
    <button
      @click="toggleTheme"
      class="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center group"
      :title="themeStore.isDark ? '切换到浅色主题' : '切换到深色主题'"
    >
      <SunIcon 
        v-if="themeStore.isDark"
        class="w-5 h-5 text-yellow-500 group-hover:text-yellow-600"
      />
      <MoonIcon 
        v-else
        class="w-5 h-5 text-slate-600 group-hover:text-slate-700"
      />
    </button>
    
    <!-- 侧边栏切换（移动端） -->
    <button
      @click="toggleSidebar"
      class="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center group lg:hidden"
      title="切换菜单"
    >
      <Bars3Icon 
        v-if="!themeStore.isSidebarOpen"
        class="w-5 h-5 text-slate-600 group-hover:text-slate-700"
      />
      <XMarkIcon 
        v-else
        class="w-5 h-5 text-slate-600 group-hover:text-slate-700"
      />
    </button>
    
    <!-- 回到顶部 -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0 scale-0"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-0"
    >
      <button
        v-show="showBackToTop"
        @click="scrollToTop"
        class="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center group"
        title="回到顶部"
      >
        <ArrowUpIcon class="w-5 h-5 text-slate-600 group-hover:text-slate-700" />
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import {
  PlayIcon,
  PauseIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowUpIcon
} from '@heroicons/vue/24/outline'

const themeStore = useThemeStore()
const showBackToTop = ref(false)

// 切换钞票雨
const toggleMoneyRain = () => {
  themeStore.toggleMoneyRain()
}

// 切换主题
const toggleTheme = () => {
  themeStore.toggleTheme()
  themeStore.saveThemePreference()
}

// 切换侧边栏
const toggleSidebar = () => {
  themeStore.toggleSidebar()
}

// 回到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 监听滚动位置
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>