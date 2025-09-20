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
        <!-- 左侧：教育、快速概览 + 技能 -->
        <section class="panel overview">
          <h2>Education & Contact</h2>
          <div class="panel-body">
            <div class="whoami">
              <div class="handle">何致力 <span class="muted">Zhili He</span></div>
              <div class="meta">南洋理工大学，区块链，硕士 2025.8 - 2026.6 (Pending)</div>
              <div class="meta">电子科技大学，数字媒体技术，本科 2021.9 - 2025.7</div>
              <div class="meta">Email: <a :href="`mailto:${email}`">{{ email }}</a></div>
              <div class="meta">Phone: <a :href="`tel:${phone}`">{{ phone }}</a></div>
              <div class="meta">个人主页: <a :href="github" target="_blank">{{ github }}</a></div>
              <div class="note">奖励/荣誉：标兵奖学金*2；校社会优秀实践个人*1</div>
            </div>

              <!-- Core Skills moved to Experience panel -->
          </div>
        </section>

        <!-- 中间：教育与经历 -->
        <section class="panel timeline">
          <h2>Experience & Skills</h2>
          <div class="panel-body">
            <ul class="bold-list">
              <li>参与并实现了基于深度学习的胃肠道内窥镜图像诊断模型（Kvasir 测试集准确率 87.25%）。</li>
              <li>在成都晓多科技实习期间，协助搭建数据清洗与微调流程，参与部署智能客服 Agent（上线 30 个，整体对话准确率 >90%）。</li>
              <li>在校项目中负责 Unity 游戏的核心功能与 UI 实现，提升了项目的稳定性与用户体验。</li>
              <li>参与南洋理工人工智能实验室研究，承担模型搭建与实验工作，并参与论文写作。</li>
            </ul>

            <!-- Core Skills progress bars -->
            <h3 style="margin-top:12px">Core Skills</h3>
            <div class="skills">
              <div class="skill-row">
                <div class="skill-label">Python</div>
                <div class="skill-bar"><div class="skill-fill" :style="{width: python+'%'}"></div></div>
                <div class="skill-percent">{{ python }}%</div>
                <div class="skill-desc">深度学习模型构建与优化，数据处理与计算机视觉</div>
              </div>

              <div class="skill-row">
                <div class="skill-label">C / C++</div>
                <div class="skill-bar"><div class="skill-fill" :style="{width: cpp+'%'}"></div></div>
                <div class="skill-percent">{{ cpp }}%</div>
                <div class="skill-desc">系统编程、数据结构与算法实现</div>
              </div>

              <div class="skill-row">
                <div class="skill-label">C#</div>
                <div class="skill-bar"><div class="skill-fill" :style="{width: csharp+'%'}"></div></div>
                <div class="skill-percent">{{ csharp }}%</div>
                <div class="skill-desc">Unity 2D/3D 游戏开发，核心逻辑实现</div>
              </div>

              <div class="skill-row">
                <div class="skill-label">Go</div>
                <div class="skill-bar"><div class="skill-fill" :style="{width: goLang+'%'}"></div></div>
                <div class="skill-percent">{{ goLang }}%</div>
                <div class="skill-desc">接口服务搭建，熟悉并发模型</div>
              </div>

              <div class="skill-row">
                <div class="skill-label">Tools</div>
                <div class="skill-bar"><div class="skill-fill" :style="{width: tools+'%'}"></div></div>
                <div class="skill-percent">{{ tools }}%</div>
                <div class="skill-desc">PyTorch、TensorFlow、NumPy、Pandas、SQL、PM2、Git、HTML/CSS/JS</div>
              </div>
            </div>

            <div class="note">论文：He, Z. (2024). Pneumonia image classification using convolutional neural network. Applied and Computational Engineering, 67, 255-266.</div>
          </div>
        </section>

        <!-- 右侧：精选项目与活动 -->
        <section class="panel projects">
          <h2>Github Repositories</h2>
          <div class="panel-body">
            <ul>
              <li><a :href="repos.gastro" target="_blank">Gastrointestinal-Diagnosis-System</a> — 胃肠道内窥镜图像诊断</li>
              <li><a :href="repos.j2e" target="_blank">J2E</a> — 教育工具与示例</li>
              <li><a :href="repos.seekvest" target="_blank">SeekVest</a> — 金融示例项目</li>
              <li><a :href="repos.imagegpt" target="_blank">ImageGPT-Hezhili-001</a> — 图像生成 / ML 实验</li>
              <li><a href="https://github.com/Shr1mpTop/hezhili.online" target="_blank">hezhili.online</a> — 本网站源码 & 作品集（Vue）</li>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import '../css/about.css'

// 基于 GitHub 与简历抓取到的关键信息（可进一步调整）
const email = 'hzl1356738145@gmail.com'
const phone = '+8615982296295'
const website = 'https://www.hezhili.online'
const github = 'https://github.com/Shr1mpTop'
const contributions = 229

const repos = {
  gastro: 'https://github.com/Shr1mpTop/Gastrointestinal-Diagnosis-System',
  j2e: 'https://github.com/Shr1mpTop/J2E',
  seekvest: 'https://github.com/Shr1mpTop/SeekVest',
  imagegpt: 'https://github.com/Shr1mpTop/ImageGPT-Hezhili-001'
}

const copyResume = async () => {
  try {
    await navigator.clipboard.writeText(window.location.origin + '/HeZhili_CV.pdf')
    alert('已复制简历链接到剪贴板')
  } catch (e) {
    alert('复制失败，请手动下载：/HeZhili_CV.pdf')
  }
}

// core skill progress values (百分比)
const python = ref(95)
const cpp = ref(85)
const csharp = ref(85)
const goLang = ref(40)
const tools = ref(75)
</script>
