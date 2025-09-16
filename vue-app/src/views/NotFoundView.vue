<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="mb-8">
        <h1 class="text-9xl font-bold text-primary-600 mb-4">404</h1>
        <h2 class="text-3xl font-semibold text-gray-800 mb-4">页面未找到</h2>
        <p class="text-xl text-gray-600 mb-8">
          抱歉，您访问的页面不存在或已被移动。
        </p>
      </div>
      
      <div class="space-y-4">
        <RouterLink
          to="/"
          class="inline-block px-8 py-3 bg-primary-600 text-white rounded-full font-semibold hover:bg-primary-700 transition-colors duration-200"
        >
          返回首页
        </RouterLink>
        
        <div>
          <button
            @click="goBack"
            class="text-primary-600 hover:text-primary-700 font-medium"
          >
            返回上一页
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'

const goBack = () => {
  window.history.back()
}
</script>