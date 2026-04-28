import ChapterSection from "../ChapterSection";

export default function GenesisSection() {
  return (
    <ChapterSection id="genesis" label="02 / Genesis">
      <h2 className="chapter-title animate-in">Education</h2>

      <div className="timeline">
        <div className="timeline-item animate-in">
          <div className="timeline-marker" />
          <div className="timeline-content">
            <h3>Nanyang Technological University</h3>
            <p className="timeline-detail">
              Master of Science in Blockchain Technology
            </p>
            <p className="timeline-date">2025.8 — 2026.6 (Pending)</p>
            <p className="timeline-location">Singapore</p>
          </div>
        </div>

        <div className="timeline-item animate-in">
          <div className="timeline-marker" />
          <div className="timeline-content">
            <h3>University of Electronic Science and Technology of China</h3>
            <p className="timeline-detail">
              Bachelor of Engineering in Digital Media Technology
            </p>
            <p className="timeline-date">2021.9 — 2025.7</p>
            <p className="timeline-location">Chengdu, China</p>
          </div>
        </div>
      </div>

      <div className="education-note animate-in">
        <p>
          <span className="note-label">Paper</span>
          He, Z. (2024). Pneumonia image classification using convolutional
          neural network. <em>Applied and Computational Engineering</em>, 67,
          255-266.
        </p>
        <p>
          <span className="note-label">Honors</span>
          标兵奖学金 ×2 · 校社会优秀实践个人 · 全国大学生市场调查与分析大赛三等奖
        </p>
      </div>
    </ChapterSection>
  );
}
