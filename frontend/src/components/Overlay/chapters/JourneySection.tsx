import ChapterSection from "../ChapterSection";

const experiences = [
  {
    title: "AI Chatbot Developer",
    org: "成都晓多科技有限公司",
    desc: "参与电商智能客服大语言模型开发，成功上线30个智能客服Agent，对话准确率超90%。",
    period: "Internship",
  },
  {
    title: "Medical AI Research",
    org: "Gastrointestinal Diagnosis System",
    desc: "主导开发基于Mamba架构的胃肠道内窥镜图像智能诊断系统，在Kvasir数据集上准确率达到87.25%。",
    period: "Research",
  },
  {
    title: "Web3 Frontend Developer",
    org: "Pioneer.Cash",
    desc: "负责前端交互系统设计与开发，项目成功入围Hackathon决赛。",
    period: "Hackathon",
  },
  {
    title: "Game Developer",
    org: "Build and Defense",
    desc: "使用Unity协作开发FPS塔防游戏，负责核心建筑系统与UI模块，显著提升游戏策略深度。",
    period: "Project",
  },
  {
    title: "Full-Stack Developer",
    org: "Twikk Web3 Social Platform",
    desc: "负责开发Web3社交平台，实现MetaMask登录、MongoDB用户系统及AI聊天等核心功能。",
    period: "Full-Stack",
  },
];

export default function JourneySection() {
  return (
    <ChapterSection id="journey" label="05 / Journey">
      <h2 className="chapter-title animate-in">Experience</h2>

      <div className="experience-list">
        {experiences.map((exp, i) => (
          <div key={i} className="experience-item animate-in">
            <div className="exp-period">{exp.period}</div>
            <div className="exp-content">
              <h3>{exp.title}</h3>
              <span className="exp-org">{exp.org}</span>
              <p>{exp.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="github-activity animate-in">
        <p>
          GitHub Activity (last year): <strong>548</strong> contributions
        </p>
        <a
          href="https://github.com/Shr1mpTop"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Profile →
        </a>
      </div>
    </ChapterSection>
  );
}
