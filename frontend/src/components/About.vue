<template>
  <div class="about-page">
    <div class="console integrated">
      <div class="console-header">
        <div class="header-left">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <div class="title">hezhili@portfolio: ~</div>
      </div>

      <div class="console-grid">
        <!-- Left Panel: Education & Contact -->
        <section class="panel overview">
          <h2>Education & Contact</h2>
          <div class="panel-body">
            <div class="whoami">
              <div class="handle">何致力 <span class="muted">Zhili He</span></div>
              <div class="meta">南洋理工大学, 区块链, 硕士 2025.8 - 2026.6 (Pending)</div>
              <div class="meta">电子科技大学, 数字媒体技术, 本科 2021.9 - 2025.7</div>
              <div class="meta">Email: <a :href="`mailto:${email}`">{{ email }}</a></div>
              <div class="meta">Phone: <a :href="`tel:${phone}`">{{ phone }}</a></div>
              <div class="meta">个人主页: <a :href="github" target="_blank">{{ github }}</a></div>
              <div class="note">奖励/荣誉：标兵奖学金*2；校社会优秀实践个人*1；全国大学生市场调查与分析大赛三等奖</div>
            </div>
            <div class="note">论文：He, Z. (2024). Pneumonia image classification using convolutional neural network. Applied and Computational Engineering, 67, 255-266.</div>
          </div>
        </section>

        <!-- Middle Panel: Experience & Skills -->
        <section class="panel timeline">
          <h2>Experience & Skills</h2>
          <div class="panel-body">
            <ul class="bold-list">
              <li>在成都晓多科技有限公司实习期间，参与电商智能客服大语言模型开发，成功上线30个智能客服Agent，对话准确率超90%。</li>
              <li>主导开发基于Mamba架构的胃肠道内窥镜图像智能诊断系统，在Kvasir数据集上准确率达到87.25%。</li>
              <li>作为前端开发者参与Pioneer.Cash隐私借贷平台，负责前端交互系统设计与开发，项目成功入围Hackathon决赛。</li>
              <li>使用Unity协作开发《Build and Defense》FPS塔防游戏，负责核心建筑系统与UI模块，显著提升游戏策略深度。</li>
              <li>负责开发Twikk Web3社交平台，实现MetaMask登录、MongoDB用户系统及AI聊天等核心功能。</li>
            </ul>

            <h3 style="margin-top:12px">Core Skills</h3>
            <div class="skills">
              <div class="skill-row">
                <div class="skill-label">Python</div>
                <div class="skill-bar"><div class="skill-fill" :style="{width: python+'%'}"></div></div>
                <div class="skill-percent">{{ python }}%</div>
                <div class="skill-desc">熟练：深度学习模型构建与优化，数据处理与计算机视觉</div>
              </div>
              <div class="skill-row">
                <div class="skill-label">Frontend</div>
                <div class="skill-bar"><div class="skill-fill" :style="{width: frontend+'%'}"></div></div>
                <div class="skill-percent">{{ frontend }}%</div>
                <div class="skill-desc">了解Vue架构，熟悉Node.js，能独立完成Web前端项目构建</div>
              </div>
              <div class="skill-row">
                <div class="skill-label">C#</div>
                <div class="skill-bar"><div class="skill-fill" :style="{width: csharp+'%'}"></div></div>
                <div class="skill-percent">{{ csharp }}%</div>
                <div class="skill-desc">基础：使用Unity进行2D/3D游戏开发，负责核心逻辑与功能模块实现</div>
              </div>
              <div class="skill-row">
                <div class="skill-label">Go</div>
                <div class="skill-bar"><div class="skill-fill" :style="{width: goLang+'%'}"></div></div>
                <div class="skill-percent">{{ goLang }}%</div>
                <div class="skill-desc">入门：能协助搭建简单接口服务，对并发模型有基础认知</div>
              </div>
              <div class="skill-row">
                <div class="skill-label">Tools</div>
                <div class="skill-bar"><div class="skill-fill" :style="{width: tools+'%'}"></div></div>
                <div class="skill-percent">{{ tools }}%</div>
                <div class="skill-desc">PyTorch, TensorFlow, Pandas, Unity, SQL, MongoDB, Git</div>
              </div>
            </div>

            
          </div>
        </section>

        <!-- Right Panel: GitHub Projects -->
        <section class="panel projects">
          <h2>Github Repositories</h2>
          <div class="panel-body">
            <ul>
              <li><a :href="repos.twikk" target="_blank">Twikk</a> <br>— 类 Twitter 的 Web3 社交平台，支持 MetaMask 登录。</li>
              <li><a :href="repos.buffotte" target="_blank">Buffotte</a> <br>— CS2 饰品市场数据可视化与交易记录平台。</li>
              <li><a :href="repos.gastro" target="_blank">Gastrointestinal-Diagnosis-System</a> <br>— 胃肠道内窥镜图像智能诊断系统。</li>
              <li><a :href="repos.portfolio" target="_blank">hezhili.online</a> <br>— 本作品集网站的仓库源码。</li>
              <li><a :href="repos.dist" target="_blank">DistributedSystem_riviewer</a> <br>— 分布式系统复习可视化。</li>
            </ul>

            <h3>Activity</h3>
            <div class="activity">Contributions (last year): <strong>{{ contributions }}</strong></div>
          </div>
        </section>
      </div>

      <div class="console-footer">
        <div class="footer-actions">
          <button class="cmd-btn" @click="copyResume">复制简历链接</button>
          <a class="cmd-btn" :href="github" target="_blank">打开 GitHub</a>
          <a class="cmd-btn" :href="website" target="_blank">访问网站</a>
        </div>
      </div>
    </div>
    <!-- Toast container -->
    <div class="toast-container" v-if="toast">
      <div class="toast" :data-show="toastVisible">{{ toast }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import '../css/about.css'

// --- Updated Information ---
const email = 'HEZH0014@e.ntu.edu.sg'
const phone = '+8615982296295'
const website = 'https://www.hezhili.online' // Your live portfolio site
const github = 'https://github.com/Shr1mpTop'
const contributions = 229 // Placeholder, update with your actual contribution count

// --- Updated GitHub Repositories ---
const repos = {
  twikk: 'https://github.com/Shr1mpTop/Twikk',
  buffotte: 'https://github.com/Shr1mpTop/Buffotte',
  gastro: 'https://github.com/Shr1mpTop/Gastrointestinal-Diagnosis-System',
  portfolio: 'https://github.com/Shr1mpTop/hezhili.online',
  dist: 'https://github.com/Shr1mpTop/DistributedSystem_riviewer'
}

// Core skill progress values (based on resume)
const python = ref(70)      // 熟练
const frontend = ref(50)    // 熟练 Vue
const csharp = ref(50)      // 基础
const goLang = ref(25)      // 入门
const tools = ref(60)       // 熟练使用多种框架和工具

// --- Toast Notification Logic ---
const toast = ref(null)
const toastVisible = ref(false)

const copyResume = async () => {
  try {
    // Make sure the PDF file name matches what you have in your project's public folder
    const resumeUrl = new URL('HeZhili_CV.pdf', window.location.origin + (import.meta.env.BASE_URL || '/')).href
    await navigator.clipboard.writeText(resumeUrl)
    showToast('已复制简历链接到剪贴板')
  } catch (e) {
    showToast('复制失败，请手动下载简历')
  }
}

const showToast = (text, ms = 1400) => {
  toast.value = text
  toastVisible.value = true
  setTimeout(() => (toastVisible.value = false), ms)
}
</script>