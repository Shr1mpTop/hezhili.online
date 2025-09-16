<template>
  <div class="min-h-screen flex items-center justify-center relative overflow-hidden">
    <!-- 主要内容区 -->
    <div class="max-w-4xl mx-auto px-6 py-12 text-center relative z-10">
      <!-- 主标题 -->
      <h1 
        class="font-chinese text-6xl md:text-8xl lg:text-9xl font-bold text-primary-800 mb-6 animate-fade-in-up text-shadow-lg"
        style="animation-delay: 0.2s"
      >
        欢迎来到我的世界
      </h1>
      
      <!-- 副标题 -->
      <p 
        class="text-xl md:text-2xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
        style="animation-delay: 0.4s"
      >
        我是<span class="font-semibold text-primary-700">何致力</span>！<br>
        来自<span class="font-semibold text-primary-700">南洋理工大学</span>的一名区块链技术在读研究生
      </p>
      
      <!-- 行动按钮 -->
      <div 
        class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up"
        style="animation-delay: 0.6s"
      >
        <RouterLink
          to="/about"
          class="px-8 py-4 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          了解更多
        </RouterLink>
        
        <RouterLink
          to="/projects"
          class="px-8 py-4 bg-white text-primary-600 border-2 border-primary-600 rounded-full font-semibold hover:bg-primary-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          查看项目
        </RouterLink>
      </div>
      
      <!-- 滚动提示 -->
      <div 
        class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
        style="animation-delay: 1s"
      >
        <ChevronDownIcon class="w-6 h-6 text-gray-400" />
      </div>
    </div>
    
    <!-- 装饰性元素 -->
    <div class="absolute top-1/4 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-float"></div>
    <div class="absolute top-1/3 right-16 w-16 h-16 bg-secondary-200 rounded-full opacity-20 animate-float" style="animation-delay: 1s"></div>
    <div class="absolute bottom-1/4 left-1/4 w-12 h-12 bg-primary-300 rounded-full opacity-20 animate-float" style="animation-delay: 2s"></div>
  </div>
  
  <!-- 特色介绍区 -->
  <section class="py-20 bg-white">
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-4xl md:text-5xl font-chinese font-bold text-center text-gray-800 mb-16">
        我的特长
      </h2>
      
      <div class="grid md:grid-cols-3 gap-8">
        <div 
          v-for="(feature, index) in features"
          :key="feature.title"
          class="text-center p-8 rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          :style="{ animationDelay: `${index * 0.2}s` }"
        >
          <div class="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
            <component :is="feature.icon" class="w-8 h-8 text-white" />
          </div>
          <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ feature.title }}</h3>
          <p class="text-gray-600 leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { 
  ChevronDownIcon,
  CodeBracketIcon,
  CubeIcon,
  AcademicCapIcon
} from '@heroicons/vue/24/outline'

// 特色功能数据
const features = [
  {
    title: '前端开发',
    description: '精通Vue.js、React等现代前端框架，擅长构建用户友好的界面和交互体验。',
    icon: CodeBracketIcon
  },
  {
    title: '区块链技术',
    description: '深入研究区块链底层技术，智能合约开发，以及去中心化应用（DApp）构建。',
    icon: CubeIcon
  },
  {
    title: '学术研究',
    description: '在南洋理工大学进行前沿的区块链技术研究，关注技术创新与实际应用。',
    icon: AcademicCapIcon
  }
]
</script>

<style scoped>
.animate-fade-in-up {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>