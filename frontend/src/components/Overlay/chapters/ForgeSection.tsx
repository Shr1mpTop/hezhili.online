import ChapterSection from "../ChapterSection";
import SkillBar from "../../shared/SkillBar";

const skills = [
  {
    label: "Python",
    value: 70,
    desc: "深度学习模型构建与优化，数据处理与计算机视觉",
  },
  {
    label: "Frontend",
    value: 50,
    desc: "熟悉Vue架构，熟悉Node.js，能独立完成Web前端项目构建",
  },
  {
    label: "C#",
    value: 50,
    desc: "使用Unity进行2D/3D游戏开发，负责核心逻辑与功能模块实现",
  },
  {
    label: "Go",
    value: 25,
    desc: "能协助搭建简单接口服务，对并发模型有基础认知",
  },
  {
    label: "Tools",
    value: 60,
    desc: "PyTorch, TensorFlow, Pandas, Unity, SQL, MongoDB, Git",
  },
];

export default function ForgeSection() {
  return (
    <ChapterSection id="forge" label="03 / Forge">
      <h2 className="chapter-title animate-in">Core Skills</h2>
      <div className="skills-grid">
        {skills.map((skill) => (
          <SkillBar key={skill.label} {...skill} />
        ))}
      </div>
    </ChapterSection>
  );
}
