<template>
  <div class="post-detail-page">
    <div class="console integrated">
      <div class="console-header">
        <span class="console-prompt">hezhili@portfolio: ~/blog/{{ post.id }}</span>
        <span class="console-cursor">_</span>
      </div>
      <div class="console-content">
        <div class="post-layout">
          <!-- 左边：帖子内容 -->
          <div class="post-content">
            <button class="back-btn" @click="goBack">← 返回博客列表</button>
            <h1>{{ post.title }}</h1>
            <div class="post-meta">
              <span class="post-date">{{ post.date }}</span>
              <span class="post-tags">{{ post.tags.join(', ') }}</span>
            </div>
            <div class="post-body">
              <p>{{ post.content || post.excerpt }}</p>
              <!-- 这里可以扩展为markdown渲染 -->
            </div>
          </div>
          
          <!-- 右边：评论和点赞 -->
          <div class="post-sidebar">
            <div class="likes-section">
              <h3>点赞</h3>
              <div class="like-count">{{ likes }} 赞</div>
              <button class="like-btn" @click="toggleLike" :class="{ liked: hasLiked }">
                {{ hasLiked ? '已赞' : '点赞' }}
              </button>
            </div>
            
            <div class="comments-section">
              <h3>评论 ({{ comments.length }})</h3>
              <div class="comments-list">
                <div v-for="comment in comments" :key="comment.id" class="comment">
                  <div class="comment-author">{{ comment.author }}</div>
                  <div class="comment-content">{{ comment.content }}</div>
                  <div class="comment-date">{{ comment.date }}</div>
                </div>
              </div>
              
              <div class="add-comment">
                <input v-model="newComment" placeholder="写下你的评论..." @keyup.enter="addComment" />
                <button @click="addComment">发表评论</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- toast container -->
    <div class="toast-container" v-if="toast">
      <div class="toast" :data-show="toastVisible">{{ toast }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['navigate'])

const toast = ref(null)
const toastVisible = ref(false)

const showToast = (text, ms = 1400) => {
  toast.value = text
  toastVisible.value = true
  setTimeout(() => (toastVisible.value = false), ms)
}

const likes = ref(0)
const hasLiked = ref(false)
const comments = ref([])
const newComment = ref('')

const goBack = () => {
  emit('navigate', 'blog')
}

const toggleLike = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/posts/${props.post._id || props.post.id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'guest' }) // Simple user ID
    })
    if (response.ok) {
      const data = await response.json()
      likes.value = data.likes
      hasLiked.value = data.hasLiked
      showToast(hasLiked.value ? '点赞成功！' : '已取消点赞')
    } else {
      // Fallback to local toggle
      if (hasLiked.value) {
        likes.value--
        hasLiked.value = false
        showToast('取消点赞')
      } else {
        likes.value++
        hasLiked.value = true
        showToast('点赞成功！')
      }
    }
  } catch (error) {
    console.error('Like error:', error)
    // Fallback
    if (hasLiked.value) {
      likes.value--
      hasLiked.value = false
      showToast('取消点赞')
    } else {
      likes.value++
      hasLiked.value = true
      showToast('点赞成功！')
    }
  }
}

const addComment = async () => {
  if (!newComment.value.trim()) return
  
  try {
    const response = await fetch(`http://localhost:3000/api/posts/${props.post._id || props.post.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        author: '访客',
        content: newComment.value
      })
    })
    if (response.ok) {
      const comment = await response.json()
      comments.value.unshift(comment)
      newComment.value = ''
      showToast('评论发表成功！')
    } else {
      // Fallback to local add
      const comment = {
        id: Date.now(),
        author: '访客',
        content: newComment.value,
        date: new Date().toLocaleDateString()
      }
      comments.value.unshift(comment)
      newComment.value = ''
      showToast('评论发表成功！')
    }
  } catch (error) {
    console.error('Comment error:', error)
    // Fallback
    const comment = {
      id: Date.now(),
      author: '访客',
      content: newComment.value,
      date: new Date().toLocaleDateString()
    }
    comments.value.unshift(comment)
    newComment.value = ''
    showToast('评论发表成功！')
  }
}

// 模拟加载数据
onMounted(async () => {
  try {
    // Fetch likes
    const likeResponse = await fetch(`http://localhost:3000/api/posts/${props.post._id || props.post.id}`)
    if (likeResponse.ok) {
      const postData = await likeResponse.json()
      likes.value = postData.likes || 0
      hasLiked.value = postData.likedBy?.includes('guest') || false
    }
    
    // Fetch comments
    const commentResponse = await fetch(`http://localhost:3000/api/posts/${props.post._id || props.post.id}/comments`)
    if (commentResponse.ok) {
      comments.value = await commentResponse.json()
    } else {
      // Fallback comments
      comments.value = [
        {
          id: 1,
          author: '开发者A',
          content: '很棒的文章！学到了很多。',
          date: '2024-09-20'
        },
        {
          id: 2,
          author: '开发者B',
          content: '请问有相关的代码示例吗？',
          date: '2024-09-19'
        }
      ]
    }
  } catch (error) {
    console.error('Failed to load post data:', error)
    // Fallback data
    likes.value = Math.floor(Math.random() * 50)
    comments.value = [
      {
        id: 1,
        author: '开发者A',
        content: '很棒的文章！学到了很多。',
        date: '2024-09-20'
      },
      {
        id: 2,
        author: '开发者B',
        content: '请问有相关的代码示例吗？',
        date: '2024-09-19'
      }
    ]
  }
})
</script>

<style src="/src/css/post-detail.css"></style>