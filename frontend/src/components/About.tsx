import { useEffect, useMemo, useState } from "react";
import "./About.css";

const bootSequence = [
  { text: "> Initializing system...", delay: 200 },
  { text: "> Loading kernel modules...", delay: 150 },
  { text: "[OK] Memory allocation complete", delay: 100, type: "success" },
  { text: "[OK] Network interface detected", delay: 100, type: "success" },
  { text: "> Authenticating user credentials...", delay: 200 },
  { text: "[OK] User authenticated: hezhili", delay: 150, type: "success" },
  { text: "", delay: 50 },
  { text: "[INFO] Loading personal profile...", delay: 150, type: "info" },
  { text: "[INFO] Fetching GitHub activity...", delay: 100, type: "info" },
  { text: "[OK] All modules loaded successfully", delay: 150, type: "success" },
  { text: "", delay: 100 },
  { text: "> Welcome to He Zhili's Portfolio Terminal", delay: 200 },
];

function About() {
  const [terminalLines, setTerminalLines] = useState<
    Array<{ text: string; type?: string }>
  >([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    let unmounted = false;
    const run = async () => {
      for (const line of bootSequence) {
        await new Promise((resolve) => setTimeout(resolve, line.delay));
        if (unmounted) return;
        setTerminalLines((prev) => [...prev, line]);
      }
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (!unmounted) setShowContent(true);
    };
    run();
    return () => {
      unmounted = true;
    };
  }, []);

  const skills = useMemo(
    () => [
      {
        label: "Python",
        value: 70,
        desc: "熟练：深度学习模型构建与优化，数据处理与计算机视觉",
      },
      {
        label: "Frontend",
        value: 50,
        desc: "了解Vue架构，熟悉Node.js，能独立完成Web前端项目构建",
      },
      {
        label: "C#",
        value: 50,
        desc: "基础：使用Unity进行2D/3D游戏开发，负责核心逻辑与功能模块实现",
      },
      {
        label: "Go",
        value: 25,
        desc: "入门：能协助搭建简单接口服务，对并发模型有基础认知",
      },
      {
        label: "Tools",
        value: 60,
        desc: "PyTorch, TensorFlow, Pandas, Unity, SQL, MongoDB, Git",
      },
    ],
    [],
  );

  return (
    <div className="about-page">
      <div className="console integrated">
        <div className="console-header">
          <div className="header-left">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
            <div className="title">hezhili@portfolio: ~</div>
          </div>
          <div className="header-status">
            <span className="status-indicator"></span>
            <span>ACTIVE</span>
          </div>
        </div>

        {!showContent && (
          <div className="boot-sequence">
            {terminalLines.map((line, index) => (
              <div
                key={index}
                className={`terminal-line ${line.type === "success" ? "success-line" : ""} ${line.type === "info" ? "info-line" : ""}`}
              >
                {line.text && <span className="line-content">{line.text}</span>}
              </div>
            ))}
            <span className="boot-cursor">_</span>
          </div>
        )}

        {showContent && (
          <>
            <div className="console-grid">
              <section className="panel overview">
                <h2>Education & Contact</h2>
                <div className="panel-body">
                  <div className="whoami">
                    <div className="handle">
                      何致力 <span className="muted">Zhili He</span>
                    </div>
                    <div className="meta">
                      南洋理工大学, 区块链, 硕士 2025.8 - 2026.6 (Pending)
                    </div>
                    <div className="meta">
                      电子科技大学, 数字媒体技术, 本科 2021.9 - 2025.7
                    </div>
                    <div className="meta">Email: HEZH0014@e.ntu.edu.sg</div>
                    <div className="meta">Phone: +8615982296295</div>
                    <div className="meta">
                      个人主页: https://www.hezhili.online
                    </div>
                    <div className="note">
                      奖励/荣誉：标兵奖学金*2；校社会优秀实践个人*1；全国大学生市场调查与分析大赛三等奖
                    </div>
                  </div>
                  <div className="note">
                    论文：He, Z. (2024). Pneumonia image classification using
                    convolutional neural network. Applied and Computational
                    Engineering, 67, 255-266.
                  </div>
                </div>
              </section>

              <section className="panel timeline">
                <h2>Experience & Skills</h2>
                <div className="panel-body">
                  <ul className="bold-list">
                    <li>
                      在成都晓多科技有限公司实习期间，参与电商智能客服大语言模型开发，成功上线30个智能客服Agent，对话准确率超90%。
                    </li>
                    <li>
                      主导开发基于Mamba架构的胃肠道内窥镜图像智能诊断系统，在Kvasir数据集上准确率达到87.25%。
                    </li>
                    <li>
                      作为前端开发者参与Pioneer.Cash隐私借贷平台，负责前端交互系统设计与开发，项目成功入围Hackathon决赛。
                    </li>
                    <li>
                      使用Unity协作开发《Build and
                      Defense》FPS塔防游戏，负责核心建筑系统与UI模块，显著提升游戏策略深度。
                    </li>
                    <li>
                      负责开发Twikk
                      Web3社交平台，实现MetaMask登录、MongoDB用户系统及AI聊天等核心功能。
                    </li>
                  </ul>

                  <h3 style={{ marginTop: 12 }}>Core Skills</h3>
                  <div className="skills">
                    {skills.map((skill) => (
                      <div className="skill-row" key={skill.label}>
                        <div className="skill-label">{skill.label}</div>
                        <div className="skill-bar">
                          <div
                            className="skill-fill"
                            style={{ width: `${skill.value}%` }}
                          ></div>
                        </div>
                        <div className="skill-percent">{skill.value}%</div>
                        <div className="skill-desc">{skill.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="panel projects">
                <h2>Github Repositories</h2>
                <div className="panel-body">
                  <ul>
                    <li>
                      <a
                        href="https://github.com/Shr1mpTop/Twikk"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Twikk
                      </a>{" "}
                      — 类 Twitter 的 Web3 社交平台，支持 MetaMask 登录。
                    </li>
                    <li>
                      <a
                        href="https://github.com/Shr1mpTop/Buffotte"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Buffotte
                      </a>{" "}
                      — CS2 饰品市场数据可视化与交易记录平台。
                    </li>
                    <li>
                      <a
                        href="https://github.com/Shr1mpTop/Gastrointestinal-Diagnosis-System"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Gastrointestinal-Diagnosis-System
                      </a>{" "}
                      — 胃肠道内窥镜图像智能诊断系统。
                    </li>
                    <li>
                      <a
                        href="https://github.com/Shr1mpTop/hezhili.online"
                        target="_blank"
                        rel="noreferrer"
                      >
                        hezhili.online
                      </a>{" "}
                      — 本作品集网站的仓库源码。
                    </li>
                    <li>
                      <a
                        href="https://github.com/Shr1mpTop/DistributedSystem_riviewer"
                        target="_blank"
                        rel="noreferrer"
                      >
                        DistributedSystem_riviewer
                      </a>{" "}
                      — 分布式系统复习可视化。
                    </li>
                  </ul>

                  <h3>Activity</h3>
                  <div className="activity">
                    Contributions (last year): <strong>548</strong>
                  </div>
                </div>
              </section>
            </div>

            <div className="console-footer">
              <div className="footer-actions">
                <a
                  className="cmd-btn"
                  href="/HeZhili_CV.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  简历
                </a>
                <a
                  className="cmd-btn"
                  href="/HeZhili_CV__English.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Resume
                </a>
                <a
                  className="cmd-btn"
                  href="https://github.com/Shr1mpTop"
                  target="_blank"
                  rel="noreferrer"
                >
                  打开 GitHub
                </a>
                <a
                  className="cmd-btn"
                  href="https://www.hezhili.online"
                  target="_blank"
                  rel="noreferrer"
                >
                  访问网站
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default About;
