# 何致力个人网站 - Vue 3 版本

一个现代化、响应式的个人展示网站，基于 Vue 3 + TypeScript + Tailwind CSS 构建。

## ✨ 特性

- 🚀 **现代技术栈**: Vue 3 + Composition API + TypeScript
- 🎨 **精美设计**: Tailwind CSS + 响应式布局
- 📱 **移动端优先**: 完美适配各种设备
- ⚡ **高性能**: Vite 构建 + 代码分割 + 懒加载
- 🎭 **动画效果**: 流畅的过渡动画和交互效果
- 🌙 **主题切换**: 支持明暗主题
- 💎 **代码质量**: ESLint + Prettier + TypeScript
- 🔧 **开发体验**: 热重载 + 类型检查
- 📦 **易于部署**: 静态站点生成

## 🛠️ 技术栈

### 核心框架
- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [TypeScript](https://www.typescriptlang.org/) - 带类型的 JavaScript
- [Vite](https://vitejs.dev/) - 下一代前端构建工具

### UI 和样式
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Headless UI](https://headlessui.com/) - 无样式的可访问 UI 组件
- [Heroicons](https://heroicons.com/) - 漂亮的手工制作的 SVG 图标

### 状态管理和路由
- [Pinia](https://pinia.vuejs.org/) - Vue 的状态管理库
- [Vue Router](https://router.vuejs.org/) - Vue.js 官方路由器

### 开发工具
- [ESLint](https://eslint.org/) - 代码检查工具
- [Prettier](https://prettier.io/) - 代码格式化工具
- [Husky](https://typicode.github.io/husky/) - Git hooks 工具
- [lint-staged](https://github.com/okonet/lint-staged) - 对暂存文件运行 linters

### 测试
- [Vitest](https://vitest.dev/) - 单元测试框架
- [Cypress](https://www.cypress.io/) - E2E 测试框架

### 动画和交互
- [GSAP](https://greensock.com/gsap/) - 高性能动画库
- [Three.js](https://threejs.org/) - 3D 图形库
- [Lottie](https://airbnb.design/lottie/) - 动画库

## 📁 项目结构

```
vue-app/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 资源文件
│   ├── components/        # Vue 组件
│   ├── composables/       # 组合式函数
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia 状态管理
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   ├── views/            # 页面组件
│   ├── App.vue           # 根组件
│   ├── main.ts           # 入口文件
│   └── style.css         # 全局样式
├── tests/                # 测试文件
├── .env                  # 环境变量
├── .eslintrc.js         # ESLint 配置
├── .prettierrc          # Prettier 配置
├── index.html           # HTML 模板
├── package.json         # 项目配置
├── tailwind.config.js   # Tailwind 配置
├── tsconfig.json        # TypeScript 配置
└── vite.config.ts       # Vite 配置
```

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发

```bash
npm run dev
# 或
yarn dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

### 构建

```bash
npm run build
# 或
yarn build
```

### 预览构建结果

```bash
npm run preview
# 或
yarn preview
```

### 测试

```bash
# 单元测试
npm run test
# 或
yarn test

# E2E 测试
npm run test:e2e
# 或
yarn test:e2e
```

### 代码检查

```bash
# 检查代码
npm run lint
# 或
yarn lint

# 格式化代码
npm run format
# 或
yarn format
```

## 📱 响应式设计

网站采用移动端优先的响应式设计，支持以下断点：

- **手机**: < 768px
- **平板**: 768px - 1024px
- **桌面**: > 1024px

## 🎨 设计特性

### 主题系统
- 支持明暗主题切换
- 自动适应系统主题
- 平滑的主题过渡动画

### 动画效果
- CSS 过渡动画
- GSAP 高性能动画
- 钞票雨特效
- 页面切换动画

### 交互特性
- 可折叠侧边栏
- 平滑滚动
- 回到顶部按钮
- 触摸友好的交互

## ⚡ 性能优化

### 构建优化
- 代码分割
- 懒加载路由
- 资源压缩
- Tree-shaking

### 运行时优化
- 图片懒加载
- 防抖节流
- 虚拟滚动
- 缓存策略

## 🔧 配置说明

### 环境变量

在项目根目录创建环境变量文件：

```bash
# .env.local
VITE_APP_TITLE=你的网站标题
VITE_APP_DESCRIPTION=你的网站描述
VITE_API_BASE_URL=你的API地址
```

### Tailwind 自定义

编辑 `tailwind.config.js` 来自定义样式：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // 你的主色调
        }
      }
    }
  }
}
```

## 📋 开发指南

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 规则
- 使用 Prettier 格式化代码
- 遵循 Vue 3 组合式 API 最佳实践

### 组件开发

```vue
<template>
  <!-- 你的模板 -->
</template>

<script setup lang="ts">
// 使用组合式 API
import { ref, computed } from 'vue'

// 类型定义
interface Props {
  title: string
}

const props = defineProps<Props>()
</script>
```

### 状态管理

```typescript
// stores/example.ts
import { defineStore } from 'pinia'

export const useExampleStore = defineStore('example', () => {
  const state = ref('initial')
  
  const getter = computed(() => state.value.toUpperCase())
  
  const action = () => {
    state.value = 'updated'
  }
  
  return { state, getter, action }
})
```

## 🚢 部署

### 静态部署

构建后的文件在 `dist` 目录，可以部署到任何静态文件服务器。

### GitHub Pages

```bash
npm run build
# 将 dist 目录内容部署到 GitHub Pages
```

### Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### Netlify

1. 连接 GitHub 仓库
2. 设置构建命令: `npm run build`
3. 设置发布目录: `dist`

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 👨‍💻 作者

**何致力**

- 网站: [https://hezhili.online](https://hezhili.online)
- GitHub: [@Shr1mpTop](https://github.com/Shr1mpTop)
- 邮箱: contact@hezhili.online

## 🙏 致谢

感谢以下优秀的开源项目：

- [Vue.js](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

如果这个项目对你有帮助，请给个 ⭐️ 支持一下！