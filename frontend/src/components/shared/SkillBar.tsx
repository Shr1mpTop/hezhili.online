import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  label: string;
  value: number;
  desc: string;
}

export default function SkillBar({ label, value, desc }: Props) {
  const fillRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fillRef.current || !containerRef.current) return;

    gsap.fromTo(
      fillRef.current,
      { width: "0%" },
      {
        width: `${value}%`,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          end: "top 50%",
          scrub: 1,
        },
      },
    );
  }, [value]);

  return (
    <div className="skill-bar-container animate-in" ref={containerRef}>
      <div className="skill-bar-header">
        <span className="skill-label">{label}</span>
        <span className="skill-percent">{value}%</span>
      </div>
      <div className="skill-bar-track">
        <div className="skill-bar-fill" ref={fillRef} />
      </div>
      <div className="skill-desc">{desc}</div>
    </div>
  );
}
