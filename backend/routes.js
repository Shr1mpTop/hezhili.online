const express = require('express');
const router = express.Router();

// Import models (assuming they are defined elsewhere)
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const EmailService = require('./email-service');

const BUFFOTTE_REPORT_URL = 'https://buffotte.hezhili.online/report';

// ============ 联系反馈邮件 API ============

// 发送反馈邮件
router.post('/contact/feedback', async (req, res) => {
  try {
    const { feedback, email } = req.body;
    
    if (!feedback || feedback.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: '反馈内容不能为空' 
      });
    }
    
    if (feedback.length > 5000) {
      return res.status(400).json({ 
        success: false, 
        error: '反馈内容过长，请控制在5000字以内' 
      });
    }
    
    const emailService = new EmailService();
    const userEmail = email && email.trim() ? email.trim() : null;
    
    // 发送反馈给作者
    await emailService.sendFeedbackToAuthor(feedback, userEmail || '匿名用户');
    
    // 如果用户提供了邮箱，发送确认邮件
    if (userEmail) {
      // 简单的邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(userEmail)) {
        try {
          await emailService.sendConfirmationToUser(userEmail, feedback);
        } catch (confirmError) {
          console.error('发送确认邮件失败:', confirmError);
          // 不影响主流程，只记录错误
        }
      }
    }
    
    res.json({ 
      success: true, 
      message: '反馈已成功发送，感谢您的意见！',
      confirmationSent: !!userEmail
    });
    
  } catch (error) {
    console.error('发送反馈邮件失败:', error);
    res.status(500).json({ 
      success: false, 
      error: '发送失败，请稍后再试' 
    });
  }
});

// ============ Buffotte Report API ============

router.get('/buffotte/report', async (req, res) => {
  try {
    const response = await fetch(BUFFOTTE_REPORT_URL, {
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Buffotte report upstream returned ${response.status}`
      });
    }

    const payload = await response.json();
    const data = payload.data || payload;

    res.json({ status: 'success', data });
  } catch (error) {
    console.error('Failed to proxy Buffotte report:', error);
    res.status(502).json({ error: '无法获取 Buffotte 报告，请稍后再试。' });
  }
});

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new post
router.post('/posts', async (req, res) => {
  try {
    const { title, content, excerpt, tags } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const post = new Post({
      title,
      content, // Markdown content
      excerpt: excerpt || content.substring(0, 200) + '...',
      tags: tags || []
    });
    
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single post
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like a post
router.post('/posts/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    
    const userId = req.body.userId || req.ip; // Simple IP-based tracking
    
    if (post.likedBy.includes(userId)) {
      // Unlike
      post.likes--;
      post.likedBy = post.likedBy.filter(id => id !== userId);
    } else {
      // Like
      post.likes++;
      post.likedBy.push(userId);
    }
    
    await post.save();
    res.json({ likes: post.likes, hasLiked: post.likedBy.includes(userId) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get comments for a post
router.get('/posts/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.id }).sort({ date: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add comment
router.post('/posts/:id/comments', async (req, res) => {
  try {
    const comment = new Comment({
      postId: req.params.id,
      author: req.body.author || 'Anonymous',
      content: req.body.content
    });
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed initial data
router.post('/seed', async (req, res) => {
  try {
    // Clear existing data first
    await Post.deleteMany({});
    await Comment.deleteMany({});
    
    const posts = [
      {
        title: 'Vue 3 Composition API 最佳实践',
        content: `# Vue 3 Composition API 最佳实践

## 引言

Vue 3 的 Composition API 为我们提供了更灵活和强大的方式来组织组件逻辑。本文将深入探讨 Composition API 的核心概念和最佳实践。

## 核心概念

### 响应式数据管理

\`\`\`javascript
import { ref, reactive, computed } from 'vue'

export default {
  setup() {
    const count = ref(0)
    const state = reactive({
      message: 'Hello Vue 3!'
    })
    
    const doubleCount = computed(() => count.value * 2)
    
    return {
      count,
      state,
      doubleCount
    }
  }
}
\`\`\`

### 生命周期钩子

Composition API 中的生命周期钩子需要从 \`vue\` 中导入：

\`\`\`javascript
import { onMounted, onUnmounted, onUpdated } from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    onUnmounted(() => {
      console.log('组件已卸载')
    })
  }
}
\`\`\`

## 组合函数 (Composables)

组合函数是 Composition API 的强大特性，让我们能够封装和复用逻辑：

\`\`\`javascript
// useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  const update = (e) => {
    x.value = e.pageX
    y.value = e.pageY
  }

  onMounted(() => {
    window.addEventListener('mousemove', update)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })

  return { x, y }
}
\`\`\`

## 最佳实践

1. **使用组合函数封装逻辑**
2. **合理组织代码结构**
3. **注意响应式陷阱**
4. **性能优化**

## 总结

Composition API 为 Vue 开发带来了新的可能性，掌握这些最佳实践将帮助你写出更高质量的代码。`,
        excerpt: '探索Vue 3 Composition API的核心概念和最佳实践，包括响应式数据管理、生命周期钩子、以及如何构建可复用的组合函数。',
        tags: ['Vue.js', '前端开发', 'Composition API']
      },
      {
        title: 'Python异步编程：从asyncio到并发优化',
        content: `# Python异步编程：从asyncio到并发优化

## 异步编程基础

Python 的 asyncio 模块为我们提供了强大的异步编程能力。让我们从基础开始学习。

### 协程基础

\`\`\`python
import asyncio

async def hello():
    print("Hello")
    await asyncio.sleep(1)
    print("World")

# 运行协程
asyncio.run(hello())
\`\`\`

### 并发执行任务

\`\`\`python
import asyncio

async def task(name, delay):
    print(f"开始任务 {name}")
    await asyncio.sleep(delay)
    print(f"完成任务 {name}")

async def main():
    # 并发执行多个任务
    await asyncio.gather(
        task("A", 2),
        task("B", 1),
        task("C", 3)
    )

asyncio.run(main())
\`\`\`

## 异步上下文管理器

\`\`\`python
import asyncio
import aiohttp

async def fetch_url(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.text()
\`\`\`

## 性能优化技巧

1. **避免阻塞操作**
2. **合理使用连接池**
3. **批量处理数据**
4. **监控和调优**

## 实际应用案例

异步编程在 Web 开发、网络爬虫、API 客户端等领域都有广泛应用。`,
        excerpt: '深入了解Python的asyncio模块，学习如何编写高效的异步代码，以及在实际项目中应用并发优化技术。',
        tags: ['Python', '异步编程', '并发']
      },
      {
        title: 'Docker容器化部署实践指南',
        content: `# Docker容器化部署实践指南

## Docker 基础概念

Docker 是现代应用部署的基石，让我们从基础开始学习。

### Dockerfile 编写

\`\`\`dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
\`\`\`

### Docker Compose 配置

\`\`\`yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
  db:
    image: mongo:5.0
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:
\`\`\`

## 容器化最佳实践

1. **使用多阶段构建**
2. **优化镜像大小**
3. **安全配置**
4. **日志管理**

## 部署策略

- **蓝绿部署**
- **滚动更新**
- **金丝雀发布**

## 监控和维护

- 容器健康检查
- 日志聚合
- 性能监控
- 自动扩缩容`,
        excerpt: '从零开始学习Docker容器化技术，包括镜像构建、多容器编排、以及在生产环境中部署应用的完整流程。',
        tags: ['Docker', '容器化', 'DevOps']
      },
      {
        title: '机器学习模型部署到Web应用',
        content: `# 机器学习模型部署到Web应用

## 模型部署概述

将训练好的机器学习模型集成到Web应用中需要考虑多个方面。

### Flask API 开发

\`\`\`python
from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)
model = joblib.load('model.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    features = np.array(data['features']).reshape(1, -1)
    prediction = model.predict(features)
    return jsonify({'prediction': prediction.tolist()})

if __name__ == '__main__':
    app.run(debug=True)
\`\`\`

### 前端集成

\`\`\`javascript
async function predict(features) {
    const response = await fetch('/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features })
    });
    const result = await response.json();
    return result.prediction;
}
\`\`\`

## 部署考虑

1. **模型序列化**
2. **性能优化**
3. **错误处理**
4. **安全性**

## 生产环境部署

- 使用 Gunicorn 或 uWSGI
- 配置反向代理
- 实施监控和日志
- 考虑容器化部署`,
        excerpt: '将训练好的机器学习模型集成到Web应用中，实现模型推理API和用户友好的界面设计。',
        tags: ['机器学习', 'Web开发', 'Flask']
      }
    ];

    await Post.insertMany(posts);
    res.json({ message: 'Data seeded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;