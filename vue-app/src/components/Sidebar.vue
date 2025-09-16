<template>
  <aside
    class="fixed left-0 top-0 h-full bg-gradient-to-b from-primary-600 to-primary-900 dark:from-gray-800 dark:to-gray-900 text-white shadow-2xl z-30 transition-all duration-300 ease-in-out"
    :class="{
      'w-80': !isCollapsed && !isMobile,
      'w-16': isCollapsed && !isMobile,
      'w-80 translate-x-0': isOpen && isMobile,
      'w-80 -translate-x-full': !isOpen && isMobile
    }"
  >
    <!-- 切换按钮 -->
    <button
      @click="toggleSidebar"
      class="absolute -right-3 top-4 w-6 h-6 bg-white dark:bg-gray-100 text-primary-700 dark:text-gray-700 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-200 hover:shadow-xl"
      :class="{ 'hidden': isMobile }"
    >
      <ChevronLeftIcon 
        class="w-4 h-4 transition-transform duration-200" 
        :class="{ 'rotate-180': isCollapsed }"
      />
    </button>
    
    <!-- 头部 -->
    <div class="p-6 border-b border-white/10">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <span class="text-xl font-bold">何</span>
        </div>
        <div class="transition-opacity duration-200" :class="{ 'opacity-0 w-0 overflow-hidden': isCollapsed, 'opacity-100': !isCollapsed }">
          <h2 class="text-lg font-semibold font-chinese">导航</h2>
          <p class="text-sm text-white/70">Hello, Zhili!</p>
        </div>
      </div>
    </div>
    
    <!-- 导航菜单 -->
    <nav class="flex-1 p-4">
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.name">
          <RouterLink
            :to="item.path"
            class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/10 hover:shadow-md group relative overflow-hidden"
            :class="{
              'bg-white/20 shadow-lg': $route.path === item.path,
              'justify-center': isCollapsed
            }"
            active-class="bg-white/20 shadow-lg"
          >
            <component 
              :is="item.icon" 
              class="w-5 h-5 flex-shrink-0"
              :class="{
                'text-white': $route.path === item.path,
                'text-white/70 group-hover:text-white': $route.path !== item.path
              }"
            />
            <span 
              class="font-medium transition-opacity duration-200"
              :class="{ 'opacity-0 w-0 overflow-hidden': isCollapsed, 'opacity-100': !isCollapsed }"
            >
              {{ item.name }}
            </span>
          </RouterLink>
        </li>
      </ul>
    </nav>
    
    <!-- 底部信息 -->
    <div class="p-4 border-t border-white/10">
      <div class="transition-opacity duration-200" :class="{ 'opacity-0 w-0 overflow-hidden': isCollapsed, 'opacity-100': !isCollapsed }">
        <p class="text-xs text-white/50 text-center">
          © 2024 何致力<br>
          南洋理工大学
        </p>
      </div>
    </div>
    
    <!-- 移动端遮罩 -->
    <div
      v-if="isMobile && isOpen"
      @click="closeSidebar"
      class="fixed inset-0 bg-black/50 z-20 lg:hidden"
    ></div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import {
  HomeIcon,
  UserIcon,
  FolderIcon,
  EnvelopeIcon,
  ChevronLeftIcon
} from '@heroicons/vue/24/outline'

interface MenuItem {
  name: string
  path: string
  icon: any
  external?: boolean
}

const route = useRoute()
const themeStore = useThemeStore()

// 响应式状态
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value < 1024)
const isCollapsed = computed(() => themeStore.isSidebarCollapsed)
const isOpen = computed(() => themeStore.isSidebarOpen)

// 菜单项
const menuItems: MenuItem[] = [
  {
    name: '主页',
    path: '/',
    icon: HomeIcon
  },
  {
    name: '关于我',
    path: '/about',
    icon: UserIcon
  },
  {
    name: '项目展示',
    path: '/projects',
    icon: FolderIcon
  },
  {
    name: '联系我',
    path: '/contact',
    icon: EnvelopeIcon
  }
]

// 切换侧边栏
const toggleSidebar = () => {
  if (isMobile.value) {
    themeStore.toggleSidebar()
  } else {
    if (isCollapsed.value) {
      themeStore.expandSidebar()
    } else {
      themeStore.collapseSidebar()
    }
  }
}

const closeSidebar = () => {
  themeStore.toggleSidebar()
}

// 处理窗口大小变化
const handleResize = () => {
  windowWidth.value = window.innerWidth
  
  // 在桌面端自动展开侧边栏
  if (windowWidth.value >= 1024 && !isCollapsed.value) {
    themeStore.expandSidebar()
  }
}

// 监听路由变化，在移动端关闭侧边栏
const handleRouteChange = () => {
  if (isMobile.value && isOpen.value) {
    themeStore.toggleSidebar()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  
  // 初始化侧边栏状态
  if (isMobile.value) {
    themeStore.collapseSidebar()
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 监听路由变化
watch(route, handleRouteChange)
</script>