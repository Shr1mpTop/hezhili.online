import ChapterSection from "../ChapterSection";

export default function OriginSection() {
  return (
    <ChapterSection id="origin" label="01 / Origin">
      <h1 className="chapter-title animate-in">
        何致力
        <span className="title-sub">Zhili He</span>
      </h1>
      <div className="chapter-roles animate-in">
        <span>Full-Stack Developer</span>
        <span className="role-sep">|</span>
        <span>AI Enthusiast</span>
        <span className="role-sep">|</span>
        <span>Blockchain Explorer</span>
      </div>
      <div className="chapter-motto animate-in">
        <span className="motto-quote">"</span>
        <span className="motto-text">Audentes fortuna iuvat</span>
        <span className="motto-quote">"</span>
        <span className="motto-translation">命运眷顾勇敢之人</span>
      </div>
      <div className="scroll-hint animate-in">
        <span className="scroll-arrow">↓</span>
        <span>Scroll to explore</span>
      </div>
    </ChapterSection>
  );
}
