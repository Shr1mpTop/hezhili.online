<template>
  <div :class="['sidebar', { collapsed: isCollapsed }]">
    <Button
      @click="toggleSidebar"
      class="toggle-btn my-btn"
    >
      {{ isCollapsed ? '→' : '←' }}
    </Button>

    <!-- 展开时的菜单 -->
    <ul v-if="!isCollapsed" class="menu expanded-menu">
      <li class="menu-item" @click="navigateTo('home')">
        <img src="/home-icon.svg" alt="主页" class="menu-icon" />
        <span class="menu-text">主页</span>
      </li>
      <li class="menu-item" @click="navigateTo('projects')">
        <img src="/projects-icon.svg" alt="导航" class="menu-icon" />
        <span class="menu-text">导航</span>
      </li>
      <li class="menu-item" @click="navigateTo('profile')">
        <img src="/profile-icon.svg" alt="个人简介" class="menu-icon" />
        <span class="menu-text">个人简介</span>
      </li>
      <li class="menu-item" @click="navigateTo('blog')">
        <img src="/blog-icon.svg" alt="技术博客" class="menu-icon" />
        <span class="menu-text">技术博客</span>
      </li>
      <li class="menu-item" @click="openExternal('https://buffotte.hezhili.online/')">
        <img src="/buff-tracker-icon.svg" alt="Buffotte" class="menu-icon" />
        <span class="menu-text">Buffotte</span>
      </li>
      <li class="menu-item" @click="navigateTo('contact')">
        <img src="/contact-icon.svg" alt="联系" class="menu-icon" />
        <span class="menu-text">联系</span>
      </li>
    </ul>

    <!-- 收缩时的图标菜单 -->
    <ul v-else class="menu collapsed-menu">
      <li class="menu-item collapsed-item" title="主页" @click="navigateTo('home')">
        <img src="/home-icon.svg" alt="主页" class="menu-icon collapsed-icon" />
      </li>
      <li class="menu-item collapsed-item" title="导航" @click="navigateTo('projects')">
        <img src="/projects-icon.svg" alt="导航" class="menu-icon collapsed-icon" />
      </li>
      <li class="menu-item collapsed-item" title="个人简介" @click="navigateTo('profile')">
        <img src="/profile-icon.svg" alt="个人简介" class="menu-icon collapsed-icon" />
      </li>
      <li class="menu-item collapsed-item" title="技术博客" @click="navigateTo('blog')">
        <img src="/blog-icon.svg" alt="技术博客" class="menu-icon collapsed-icon" />
      </li>
      <li class="menu-item collapsed-item" title="Buffotte" @click="openExternal('https://buffotte.hezhili.online/')">
        <img src="/buff-tracker-icon.svg" alt="Buffotte" class="menu-icon collapsed-icon" />
      </li>
      <li class="menu-item collapsed-item" title="联系" @click="navigateTo('contact')">
        <img src="/contact-icon.svg" alt="联系" class="menu-icon collapsed-icon" />
      </li>
    </ul>
  </div>
</template>

<script>
import { useSidebar } from '../composables/useSidebar.js'
import Button from './Button.vue'
import '../css/sidebar.css'

export default {
  name: 'Sidebar',
  components: {
    Button
  },
  emits: ['navigate'],
  setup(props, { emit }) {
    const { isCollapsed, toggleSidebar } = useSidebar()

    const navigateTo = (view) => {
      console.log('侧边栏点击:', view)
      emit('navigate', view)
    }

    const openExternal = (url) => {
      window.open(url, '_blank')
    }

    return {
      isCollapsed,
      toggleSidebar,
      navigateTo,
      openExternal
    }
  }
}
</script>