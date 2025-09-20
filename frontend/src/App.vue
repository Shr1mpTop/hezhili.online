<template>
  <div class="app">
    <MatrixBackground />
    <Sidebar />
    <main class="main-content">
      <h1>hezhili.online</h1>
    </main>
  </div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import Button from './components/Button.vue'
import MatrixBackground from './components/MatrixBackground.vue'
import './css/app.css'

export default {
  components: {
    Sidebar,
    Button,
    MatrixBackground
  }
}
</script>
