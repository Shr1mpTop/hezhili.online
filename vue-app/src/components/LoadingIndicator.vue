<template>
  <div class="fixed inset-0 bg-white z-50 flex items-center justify-center">
    <div class="text-center">
      <!-- 加载动画 -->
      <div class="relative mb-8">
        <div class="w-20 h-20 border-4 border-primary-200 rounded-full animate-spin"></div>
        <div class="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-primary-600 rounded-full animate-spin"></div>
      </div>
      
      <!-- 加载文字 -->
      <h2 class="text-2xl font-chinese font-semibold text-gray-800 mb-2">
        欢迎来到我的世界
      </h2>
      <p class="text-gray-600">正在加载中...</p>
      
      <!-- 进度条 -->
      <div class="mt-6 w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 无需额外逻辑，纯展示组件
</script>