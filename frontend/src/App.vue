<template>
  <div class="app">
    <Sidebar />
    <main class="main-content">
      <h1>hezhili.online</h1>
    </main>
    <Button
      @click="toggleTheme"
      class="theme-toggle-btn"
    >
      {{ theme === 'light' ? '🌙' : '☀️' }}
    </Button>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import Button from './components/Button.vue'
import { useTheme } from './composables/useTheme.js'
import './css/app.css'

export default {
  components: {
    Sidebar,
    Button
  },
  setup() {
    const { theme, toggleTheme } = useTheme()

    return {
      theme,
      toggleTheme
    }
  }
}
</script>
