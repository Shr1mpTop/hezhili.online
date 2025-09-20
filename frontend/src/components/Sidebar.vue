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
      <li class="menu-item">
        <img src="/home-icon.svg" alt="主页" class="menu-icon" />
        <span class="menu-text">主页</span>
      </li>
      <li class="menu-item">
        <img src="/projects-icon.svg" alt="项目" class="menu-icon" />
        <span class="menu-text">项目</span>
      </li>
      <li class="menu-item">
        <img src="/profile-icon.svg" alt="个人简介" class="menu-icon" />
        <span class="menu-text">个人简介</span>
      </li>
      <li class="menu-item">
        <img src="/contact-icon.svg" alt="联系" class="menu-icon" />
        <span class="menu-text">联系</span>
      </li>
    </ul>

    <!-- 收缩时的图标菜单 -->
    <ul v-else class="menu collapsed-menu">
      <li class="menu-item collapsed-item" title="主页">
        <img src="/home-icon.svg" alt="主页" class="menu-icon collapsed-icon" />
      </li>
      <li class="menu-item collapsed-item" title="项目">
        <img src="/projects-icon.svg" alt="项目" class="menu-icon collapsed-icon" />
      </li>
      <li class="menu-item collapsed-item" title="个人简介">
        <img src="/profile-icon.svg" alt="个人简介" class="menu-icon collapsed-icon" />
      </li>
      <li class="menu-item collapsed-item" title="联系">
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
  setup() {
    const { isCollapsed, toggleSidebar } = useSidebar()

    return {
      isCollapsed,
      toggleSidebar
    }
  }
}
</script>