<template>
  <div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
    <!-- 主背景 -->
    <div class="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50"></div>
    
    <!-- 图案层 1 - Bitcoin -->
    <div 
      class="absolute inset-0 opacity-30"
      :style="{ 
        backgroundImage: `url('${bitcoinIcon}')`,
        backgroundSize: patternSize + 'px',
        backgroundRepeat: 'repeat',
        backgroundPosition: '0 0'
      }"
    ></div>
    
    <!-- 图案层 2 - Ethereum (偏移) -->
    <div 
      class="absolute inset-0 opacity-20"
      :style="{ 
        backgroundImage: `url('${ethereumIcon}')`,
        backgroundSize: patternSize + 'px',
        backgroundRepeat: 'repeat',
        backgroundPosition: offsetPosition
      }"
    ></div>
    
    <!-- 安全纹理覆盖层 -->
    <div 
      class="absolute inset-0 opacity-10"
      :style="{ 
        backgroundImage: `url('${securityIcon}')`,
        backgroundSize: patternSize + 'px',
        backgroundRepeat: 'repeat'
      }"
    ></div>
    
    <!-- 渐变覆盖层 -->
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/10"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 图标路径
const bitcoinIcon = '/src/assets/bitcoin.svg'
const ethereumIcon = '/src/assets/etherum.svg'
const securityIcon = '/src/assets/security.svg'

// 响应式图案大小
const windowWidth = ref(window.innerWidth)
const patternSize = computed(() => windowWidth.value < 900 ? 160 : 240)
const offsetPosition = computed(() => {
  const offset = Math.round(patternSize.value / 2)
  return `${offset}px ${offset}px`
})

// 监听窗口大小变化
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>