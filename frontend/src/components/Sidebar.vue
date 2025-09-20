<template>
  <div :class="['sidebar', { collapsed: isCollapsed }]">
    <Button
      @click="toggleSidebar"
      class="toggle-btn"
    >
      {{ isCollapsed ? '→' : '←' }}
    </Button>
    <ul v-if="!isCollapsed" class="menu">
      <li>主页</li>
      <li>项目</li>
      <li>个人简介</li>
      <li>联系</li>
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