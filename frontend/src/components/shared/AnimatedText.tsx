import { useRef, useEffect } from "react";
import gsap from "gsap";

interface Props {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  delay?: number;
}

export default function AnimatedText({
  text,
  className = "",
  as: Tag = "div",
  delay = 0,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chars = ref.current.querySelectorAll(".char");
    gsap.fromTo(
      chars,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.03,
        duration: 0.6,
        delay,
        ease: "power2.out",
      },
    );
  }, [delay]);

  const splitText = text.split("").map((char, i) => (
    <span key={i} className="char" style={{ display: "inline-block" }}>
      {char === " " ? " " : char}
    </span>
  ));

  return (
    <Tag ref={ref as any} className={`animated-text ${className}`}>
      {splitText}
    </Tag>
  );
}
