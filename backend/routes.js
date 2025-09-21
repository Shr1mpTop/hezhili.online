const express = require('express');
const router = express.Router();

// Import models (assuming they are defined elsewhere)
const Post = require('./models/Post');
const Comment = require('./models/Comment');

// Get all posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
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
    const posts = [
      {
        title: 'Vue 3 Composition API 最佳实践',
        content: 'Vue 3 Composition API 提供了更灵活和强大的方式来组织组件逻辑...',
        excerpt: '探索Vue 3 Composition API的核心概念和最佳实践，包括响应式数据管理、生命周期钩子、以及如何构建可复用的组合函数。',
        tags: ['Vue.js', '前端开发', 'Composition API']
      },
      {
        title: 'Python异步编程：从asyncio到并发优化',
        content: 'Python的asyncio模块是异步编程的核心...',
        excerpt: '深入了解Python的asyncio模块，学习如何编写高效的异步代码，以及在实际项目中应用并发优化技术。',
        tags: ['Python', '异步编程', '并发']
      },
      {
        title: 'Docker容器化部署实践指南',
        content: 'Docker是现代应用部署的基石...',
        excerpt: '从零开始学习Docker容器化技术，包括镜像构建、多容器编排、以及在生产环境中部署应用的完整流程。',
        tags: ['Docker', '容器化', 'DevOps']
      },
      {
        title: '机器学习模型部署到Web应用',
        content: '将ML模型部署到Web应用需要考虑多个方面...',
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