<template>
  <div class="matrix-background">
    <canvas ref="canvas" class="matrix-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref(null)
let ctx = null
let animationId = null
const fontSize = 16
const lineHeight = 24
const verticalSpacing = lineHeight * 2.5 // 自适应垂直间距，基于lineHeight
const columns = ref(0)
const drops = ref([])

const matrixChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?！~'

const initializeCanvas = () => {
  if (!canvas.value) return
  
  ctx = canvas.value.getContext('2d')
  canvas.value.width = window.innerWidth
  canvas.value.height = window.innerHeight
  
  columns.value = Math.floor(canvas.value.width / fontSize)
  drops.value = new Array(columns.value).fill(1)
}

const draw = () => {
  if (!ctx) return
  
  // 更强的背景清除效果 - 完全清除旧字符
  ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
  ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
  
  // Green text
  ctx.fillStyle = '#0f0'
  ctx.font = fontSize + 'px monospace'
  
  // Loop over drops
  for (let i = 0; i < drops.value.length; i++) {
    // Random character
    const char = matrixChars[Math.floor(Math.random() * matrixChars.length)]
    
    // Draw the character
    ctx.fillText(char, i * fontSize, drops.value[i] * verticalSpacing)
    
    // Reset drop to top randomly - 提高重置概率
    if (drops.value[i] * verticalSpacing > canvas.value.height && Math.random() > 0.998) {
      drops.value[i] = 0
    }
    
    // Move drop down
    drops.value[i] += 0.2
  }
}

const animate = () => {
  draw()
  animationId = requestAnimationFrame(animate)
}

const handleResize = () => {
  initializeCanvas()
}

onMounted(() => {
  initializeCanvas()
  animate()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.matrix-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
}

.matrix-canvas {
  display: block;
  background: #000;
}
</style>