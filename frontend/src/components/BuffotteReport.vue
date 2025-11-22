<template>
  <div class="buffotte-page" :style="{ paddingLeft: isSidebarOpen ? '250px' : '90px' }">
    <div class="buffotte-wrapper">
      <header class="buffotte-header">
        <div class="header-text">
          <h1>Buffotte 市场报告</h1>
          <p class="header-meta">
            <span v-if="subjectLine">{{ subjectLine }}</span>
            <span v-if="generatedOn">生成时间：{{ generatedOn }}</span>
            <span v-if="reportDate">报告日期：{{ reportDate }}</span>
            <span v-if="lastUpdated">最近刷新：{{ lastUpdated }}</span>
          </p>
        </div>
        <button class="buffotte-refresh" type="button" @click="fetchReport" :disabled="loading">
          {{ loading ? '刷新中…' : '刷新' }}
        </button>
      </header>

      <section v-if="loading" class="buffotte-state">
        <div class="spinner" aria-hidden="true"></div>
        <p>正在获取 Buffotte 报告...</p>
      </section>

      <section v-else-if="error" class="buffotte-state buffotte-error">
        <p>{{ error }}</p>
        <button class="buffotte-refresh" type="button" @click="fetchReport">重试</button>
      </section>

      <section v-else class="buffotte-content">
        <div v-if="subjectLine || generatedOn || reportDate || lastUpdated" class="buffotte-summary">
          <h2 class="summary-title">{{ subjectLine || 'Buffotte 每日情报' }}</h2>
          <ul class="summary-meta">
            <li v-if="generatedOn">生成时间：{{ generatedOn }}</li>
            <li v-if="reportDate">报告日期：{{ reportDate }}</li>
            <li v-if="lastUpdated">最近刷新：{{ lastUpdated }}</li>
          </ul>
        </div>

        <div v-if="attachments.length" class="buffotte-attachments">
          <h3>附件</h3>
          <ul>
            <li v-for="file in attachments" :key="file.url">
              <a :href="file.url" target="_blank" rel="noopener noreferrer">{{ file.name }}</a>
            </li>
          </ul>
        </div>

        <article class="buffotte-markdown" v-html="htmlContent"></article>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import MarkdownIt from 'markdown-it'
import markdownItHighlightjs from 'markdown-it-highlightjs'
import hljs from 'highlight.js'
import { useSidebar } from '../composables/useSidebar'
import '../css/buffotte.css'
import 'highlight.js/styles/github-dark.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')
const REPORT_SOURCE_BASE = 'https://buffotte.hezhili.online/'

const { isSidebarOpen } = useSidebar()

const loading = ref(true)
const error = ref(null)
const report = ref(null)
const htmlContent = ref('')
const lastFetchedAt = ref(null)

const mdParser = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true
})
mdParser.use(markdownItHighlightjs, { hljs })

const buildApiUrl = (path) => {
  if (!API_BASE) return path
  return `${API_BASE.replace(/\/$/, '')}${path}`
}

const toAbsoluteUrl = (input) => {
  if (!input) return input
  if (/^(?:https?:)?\/\//i.test(input)) return input
  if (input.startsWith('#') || input.startsWith('data:') || input.startsWith('mailto:')) return input
  try {
    return new URL(input, REPORT_SOURCE_BASE).toString()
  } catch (err) {
    console.warn('Failed to resolve Buffotte asset URL:', input, err)
    return input
  }
}

const normalizeAssetUrls = (html) => {
  if (!html) return ''
  return html.replace(/(src|href)="([^"]+)"/gi, (match, attr, value) => {
    const absolute = toAbsoluteUrl(value)
    return absolute === value ? match : `${attr}="${absolute}"`
  })
}

const formatDateTime = (value) => {
  if (!value) return ''
  const compactPattern = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/
  const match = value.match(compactPattern)
  let date
  if (match) {
    const isoValue = `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}Z`
    date = new Date(isoValue)
  } else {
    date = new Date(value)
  }
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('zh-CN', { hour12: false })
}

const fetchReport = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await fetch(buildApiUrl('/api/buffotte/report'), {
      headers: { Accept: 'application/json' }
    })
    if (!response.ok) {
      throw new Error(`报告请求失败（${response.status}）`)
    }
    const payload = await response.json()
    if (payload.status && payload.status !== 'success') {
      throw new Error(payload.message || '报告服务返回异常')
    }
    const data = payload.data || payload
    report.value = data

    const markdownSource = data.markdown_report && data.markdown_report.trim().length > 0
      ? data.markdown_report
      : (data.body || '').replace(/\n/g, '\n\n')

    htmlContent.value = normalizeAssetUrls(mdParser.render(markdownSource))
    lastFetchedAt.value = new Date()
  } catch (err) {
    console.error('Failed to load Buffotte report:', err)
    error.value = err.message || '加载 Buffotte 报告失败'
  } finally {
    loading.value = false
  }
}

onMounted(fetchReport)

const subjectLine = computed(() => (report.value?.subject || '').trim())
const generatedOn = computed(() => formatDateTime(report.value?.generated_at))
const reportDate = computed(() => report.value?.date || '')
const lastUpdated = computed(() => lastFetchedAt.value
  ? lastFetchedAt.value.toLocaleString('zh-CN', { hour12: false })
  : '')
const attachments = computed(() => (report.value?.attachments || []).map((path) => ({
  name: path.split('/').pop() || path,
  url: toAbsoluteUrl(path)
})))

</script>
