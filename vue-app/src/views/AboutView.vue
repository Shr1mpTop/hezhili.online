<template>
  <div class="min-h-screen py-20">
    <div class="max-w-4xl mx-auto px-6">
      <!-- 页面标题 -->
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-chinese font-bold text-gray-800 mb-6">
          关于我
        </h1>
        <p class="text-xl text-gray-600">
          了解更多关于何致力的信息
        </p>
      </div>
      
      <!-- 个人简介 -->
      <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-12">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-semibold text-gray-800 mb-6">个人简介</h2>
            <div class="space-y-4 text-gray-600 leading-relaxed">
              <p>
                我是何致力，目前在新加坡南洋理工大学攻读区块链技术研究生学位。
                对前端开发和区块链技术充满热情。
              </p>
              <p>
                在学术研究方面，我专注于区块链底层技术、智能合约开发以及去中心化应用的构建。
                同时也热衷于探索新兴技术如何改变我们的生活方式。
              </p>
              <p>
                除了技术研究，我也喜欢分享知识，参与开源项目，并与志同道合的开发者交流合作。
              </p>
            </div>
          </div>
          <div class="text-center">
            <div class="w-64 h-64 mx-auto bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mb-6">
              <UserIcon class="w-32 h-32 text-primary-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-800 mb-2">何致力</h3>
            <p class="text-primary-600 font-medium">区块链技术研究生</p>
          </div>
        </div>
      </div>
      
      <!-- 技能展示 -->
      <div class="grid md:grid-cols-2 gap-8 mb-12">
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <h3 class="text-2xl font-semibold text-gray-800 mb-6">技术技能</h3>
          <div class="space-y-4">
            <div v-for="skill in technicalSkills" :key="skill.name" class="flex items-center justify-between">
              <span class="text-gray-700">{{ skill.name }}</span>
              <div class="flex-1 mx-4 bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full transition-all duration-1000"
                  :style="{ width: skill.level + '%' }"
                ></div>
              </div>
              <span class="text-sm text-gray-500">{{ skill.level }}%</span>
            </div>
          </div>
        </div>
        
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <h3 class="text-2xl font-semibold text-gray-800 mb-6">教育背景</h3>
          <div class="space-y-6">
            <div class="border-l-4 border-primary-500 pl-6">
              <h4 class="text-lg font-semibold text-gray-800">南洋理工大学</h4>
              <p class="text-primary-600 font-medium">区块链技术研究生</p>
              <p class="text-sm text-gray-500">2023 - 至今</p>
              <p class="text-gray-600 mt-2">
                专注于区块链底层技术研究、智能合约开发和去中心化应用构建
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 联系方式 -->
      <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-center text-white">
        <h3 class="text-2xl font-semibold mb-4">想要了解更多？</h3>
        <p class="text-primary-100 mb-6">欢迎与我联系，一起探讨技术话题</p>
        <RouterLink
          to="/contact"
          class="inline-block px-8 py-3 bg-white text-primary-600 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200"
        >
          联系我
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { UserIcon } from '@heroicons/vue/24/outline'

// 技术技能数据
const technicalSkills = [
  { name: 'Vue.js', level: 90 },
  { name: 'React', level: 85 },
  { name: 'TypeScript', level: 80 },
  { name: 'Node.js', level: 75 },
  { name: 'Solidity', level: 85 },
  { name: 'Web3.js', level: 80 },
  { name: 'Python', level: 70 },
  { name: 'Go', level: 65 }
]
</script>