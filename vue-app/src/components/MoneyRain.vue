<template>
  <div 
    ref="moneyRainContainer" 
    class="fixed inset-0 pointer-events-none z-10"
    :class="{ 'hidden': !isActive }"
  >
    <!-- 前景钞票雨 -->
    <div class="absolute inset-0">
      <div
        v-for="bill in bills"
        :key="bill.id"
        class="absolute text-4xl opacity-80 animate-money-fall"
        :style="{
          left: bill.x + 'px',
          top: bill.y + 'px',
          transform: `rotate(${bill.rotation}deg)`,
          animationDelay: bill.delay + 's',
          animationDuration: bill.duration + 's',
          color: bill.color
        }"
      >
        {{ bill.symbol }}
      </div>
    </div>
    
    <!-- 背景美金符号 -->
    <div class="absolute inset-0 -z-10">
      <div
        v-for="bgDollar in backgroundDollars"
        :key="bgDollar.id"
        class="absolute text-6xl opacity-20 animate-float"
        :style="{
          left: bgDollar.x + 'px',
          top: bgDollar.y + 'px',
          transform: `scale(${bgDollar.scale}) rotate(${bgDollar.rotation}deg)`,
          animationDelay: bgDollar.delay + 's',
          color: '#16a34a'
        }"
      >
        $
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { useThemeStore } from '@/stores/theme'

interface Bill {
  id: number
  x: number
  y: number
  symbol: string
  rotation: number
  delay: number
  duration: number
  color: string
}

interface BackgroundDollar {
  id: number
  x: number
  y: number
  scale: number
  rotation: number
  delay: number
}

const themeStore = useThemeStore()
const moneyRainContainer = ref<HTMLElement>()
const isActive = ref(true)

// 货币符号数组
const currencySymbols = ['$', '€', '¥', '£', '₹', '₽', '₩', '฿', '₿', '₺', '₫', '₪', '₦', '₲', '₵', '¢', '₡', '₴']

// 颜色数组
const colors = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4']

// 钞票数组
const bills = reactive<Bill[]>([])
const backgroundDollars = reactive<BackgroundDollar[]>([])

// 生成随机钞票
const generateBill = (id: number): Bill => ({
  id,
  x: Math.random() * window.innerWidth,
  y: -50,
  symbol: currencySymbols[Math.floor(Math.random() * currencySymbols.length)],
  rotation: Math.random() * 360,
  delay: Math.random() * 2,
  duration: 8 + Math.random() * 4,
  color: colors[Math.floor(Math.random() * colors.length)]
})

// 生成背景美金符号
const generateBackgroundDollar = (id: number): BackgroundDollar => ({
  id,
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  scale: 1 + Math.random() * 0.5,
  rotation: Math.random() * 360,
  delay: Math.random() * 5
})

// 初始化钞票
const initializeBills = () => {
  bills.length = 0
  backgroundDollars.length = 0
  
  // 生成前景钞票
  const billCount = Math.min(24, Math.max(12, Math.floor(window.innerWidth / 80)))
  for (let i = 0; i < billCount; i++) {
    bills.push(generateBill(i))
  }
  
  // 生成背景美金符号
  const bgCount = Math.min(7, Math.max(3, Math.floor(window.innerWidth / 200)))
  for (let i = 0; i < bgCount; i++) {
    backgroundDollars.push(generateBackgroundDollar(i))
  }
}

// 重新生成钞票（用于循环动画）
let animationTimer: number

const startAnimation = () => {
  if (animationTimer) clearInterval(animationTimer)
  
  animationTimer = setInterval(() => {
    if (isActive.value) {
      // 随机更新一些钞票位置
      const updateCount = Math.floor(bills.length / 4)
      for (let i = 0; i < updateCount; i++) {
        const randomIndex = Math.floor(Math.random() * bills.length)
        const newBill = generateBill(bills[randomIndex].id)
        bills[randomIndex] = newBill
      }
    }
  }, 3000)
}

// 窗口大小变化处理
const handleResize = () => {
  initializeBills()
}

// 监听主题store中的动画状态
watch(() => themeStore.isMoneyRainActive, (newValue) => {
  isActive.value = newValue
})

onMounted(() => {
  initializeBills()
  startAnimation()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animationTimer) clearInterval(animationTimer)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
@keyframes moneyFall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-money-fall {
  animation: moneyFall 8s linear infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}
</style>