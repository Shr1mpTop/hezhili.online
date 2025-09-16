<template>
  <div class="min-h-screen py-20">
    <div class="max-w-4xl mx-auto px-6">
      <!-- 页面标题 -->
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-chinese font-bold text-gray-800 mb-6">
          联系我
        </h1>
        <p class="text-xl text-gray-600">
          欢迎与我取得联系，一起探讨技术话题
        </p>
      </div>
      
      <div class="grid md:grid-cols-2 gap-12">
        <!-- 联系信息 -->
        <div class="space-y-8">
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">联系方式</h2>
            
            <div class="space-y-6">
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <EnvelopeIcon class="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">邮箱</h3>
                  <a href="mailto:contact@hezhili.online" class="text-primary-600 hover:text-primary-700">
                    contact@hezhili.online
                  </a>
                </div>
              </div>
              
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">GitHub</h3>
                  <a 
                    href="https://github.com/Shr1mpTop" 
                    target="_blank"
                    class="text-primary-600 hover:text-primary-700"
                  >
                    @Shr1mpTop
                  </a>
                </div>
              </div>
              
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <MapPinIcon class="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 class="font-semibold text-gray-800">位置</h3>
                  <p class="text-gray-600">新加坡 · 南洋理工大学</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 其他链接 -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-semibold text-gray-800 mb-6">其他链接</h2>
            <div class="space-y-4">
              <a 
                href="https://shr1mptop.github.io/" 
                target="_blank"
                class="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                <UserIcon class="w-5 h-5 text-primary-600" />
                <span class="text-gray-700">个人博客</span>
              </a>
            </div>
          </div>
        </div>
        
        <!-- 联系表单 -->
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <h2 class="text-2xl font-semibold text-gray-800 mb-6">发送消息</h2>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                姓名
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                placeholder="您的姓名"
              />
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                邮箱
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
                placeholder="您的邮箱地址"
              />
            </div>
            
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                消息
              </label>
              <textarea
                id="message"
                v-model="form.message"
                rows="5"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200 resize-none"
                placeholder="想对我说什么..."
              ></textarea>
            </div>
            
            <button
              type="submit"
              class="w-full py-3 px-6 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
            >
              发送消息
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  EnvelopeIcon, 
  MapPinIcon,
  UserIcon
} from '@heroicons/vue/24/outline'

// 表单数据
const form = ref({
  name: '',
  email: '',
  message: ''
})

// 处理表单提交
const handleSubmit = () => {
  // 这里可以添加实际的表单提交逻辑
  alert('感谢您的消息！我会尽快回复您。')
  
  // 重置表单
  form.value = {
    name: '',
    email: '',
    message: ''
  }
}
</script>