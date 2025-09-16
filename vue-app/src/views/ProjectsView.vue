<template>
  <div class="min-h-screen py-20">
    <div class="max-w-6xl mx-auto px-6">
      <!-- 页面标题 -->
      <div class="text-center mb-16">
        <h1 class="text-5xl md:text-6xl font-chinese font-bold text-gray-800 mb-6">
          项目展示
        </h1>
        <p class="text-xl text-gray-600">
          探索我的技术项目和创作作品
        </p>
      </div>
      
      <!-- 项目网格 -->
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <div 
          v-for="(project, index) in projects"
          :key="project.id"
          class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <!-- 项目图片 -->
          <div class="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
            <component :is="project.icon" class="w-16 h-16 text-primary-600" />
          </div>
          
          <!-- 项目信息 -->
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 mb-2">{{ project.title }}</h3>
            <p class="text-gray-600 mb-4 leading-relaxed">{{ project.description }}</p>
            
            <!-- 技术标签 -->
            <div class="flex flex-wrap gap-2 mb-4">
              <span 
                v-for="tech in project.technologies"
                :key="tech"
                class="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
              >
                {{ tech }}
              </span>
            </div>
            
            <!-- 项目链接 -->
            <div class="flex gap-3">
              <a 
                v-if="project.demoUrl"
                :href="project.demoUrl"
                target="_blank"
                class="flex-1 py-2 px-4 bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                在线演示
              </a>
              <a 
                v-if="project.githubUrl"
                :href="project.githubUrl"
                target="_blank"
                class="flex-1 py-2 px-4 border-2 border-primary-600 text-primary-600 text-center rounded-lg hover:bg-primary-50 transition-colors duration-200"
              >
                查看代码
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 更多项目提示 -->
      <div class="text-center">
        <p class="text-gray-600 mb-6">想要了解更多项目？</p>
        <a 
          href="https://github.com/Shr1mpTop"
          target="_blank"
          class="inline-flex items-center gap-2 px-8 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors duration-200"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          访问我的GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  CodeBracketIcon,
  CubeIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  BeakerIcon,
  CpuChipIcon
} from '@heroicons/vue/24/outline'

// 项目数据
const projects = [
  {
    id: 1,
    title: '个人网站',
    description: '基于Vue 3和Tailwind CSS构建的现代化个人展示网站，具有响应式设计和流畅的用户体验。',
    technologies: ['Vue 3', 'TypeScript', 'Tailwind CSS', 'Vite'],
    icon: GlobeAltIcon,
    demoUrl: 'https://hezhili.online',
    githubUrl: 'https://github.com/Shr1mpTop/hezhili.online'
  },
  {
    id: 2,
    title: '区块链投票系统',
    description: '去中心化的投票平台，利用智能合约确保投票的透明性和不可篡改性。',
    technologies: ['Solidity', 'Web3.js', 'React', 'Ethereum'],
    icon: CubeIcon,
    githubUrl: 'https://github.com/Shr1mpTop'
  },
  {
    id: 3,
    title: 'DeFi代币交换平台',
    description: '基于自动化做市商(AMM)机制的去中心化代币交换平台，支持流动性挖矿。',
    technologies: ['Solidity', 'Vue.js', 'Ethers.js', 'IPFS'],
    icon: BeakerIcon,
    githubUrl: 'https://github.com/Shr1mpTop'
  },
  {
    id: 4,
    title: '移动端加密钱包',
    description: '安全的移动端数字资产管理应用，支持多链资产管理和DApp浏览器功能。',
    technologies: ['React Native', 'TypeScript', 'Web3', 'Redux'],
    icon: DevicePhoneMobileIcon,
    githubUrl: 'https://github.com/Shr1mpTop'
  },
  {
    id: 5,
    title: 'NFT市场平台',
    description: '数字艺术品交易平台，支持NFT的铸造、展示、交易和拍卖功能。',
    technologies: ['Next.js', 'Solidity', 'IPFS', 'Moralis'],
    icon: CodeBracketIcon,
    githubUrl: 'https://github.com/Shr1mpTop'
  },
  {
    id: 6,
    title: '智能合约安全审计工具',
    description: '自动化的智能合约安全漏洞检测工具，帮助开发者识别潜在的安全风险。',
    technologies: ['Python', 'Solidity', 'Machine Learning', 'Flask'],
    icon: CpuChipIcon,
    githubUrl: 'https://github.com/Shr1mpTop'
  }
]
</script>