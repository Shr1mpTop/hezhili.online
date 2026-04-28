import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const chapters = [
  { id: "origin", label: "Origin" },
  { id: "genesis", label: "Genesis" },
  { id: "forge", label: "Forge" },
  { id: "creations", label: "Creations" },
  { id: "journey", label: "Journey" },
  { id: "connect", label: "Connect" },
];

interface Props {
  activeChapter: number;
  onBlogOpen: () => void;
  onBuffotteOpen: () => void;
}

export default function FloatingNav({
  activeChapter,
  onBlogOpen,
  onBuffotteOpen,
}: Props) {
  const [visible, setVisible] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: "#genesis",
      start: "top bottom",
      onEnter: () => setVisible(true),
      onLeaveBack: () => setVisible(false),
    });
    return () => trigger.kill();
  }, []);

  useEffect(() => {
    if (!navRef.current) return;
    gsap.to(navRef.current, {
      opacity: visible ? 1 : 0,
      y: visible ? 0 : -20,
      duration: 0.4,
      ease: "power2.out",
    });
  }, [visible]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav ref={navRef} className="floating-nav" style={{ opacity: 0 }}>
      <div className="nav-logo">HZL</div>

      <div className="nav-dots">
        {chapters.map((ch, i) => (
          <button
            key={ch.id}
            className={`nav-dot ${activeChapter === i ? "active" : ""}`}
            onClick={() => scrollTo(ch.id)}
            title={ch.label}
            type="button"
          >
            <span className="dot-inner" />
            <span className="dot-label">{ch.label}</span>
          </button>
        ))}
      </div>

      <button
        className="nav-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}
        type="button"
        aria-label="Menu"
      >
        <span className={`menu-icon ${menuOpen ? "open" : ""}`}>
          <span />
          <span />
          <span />
        </span>
      </button>

      {menuOpen && (
        <div className="nav-menu-dropdown">
          <button type="button" onClick={() => { onBlogOpen(); setMenuOpen(false); }}>
            Blog
          </button>
          <button type="button" onClick={() => { onBuffotteOpen(); setMenuOpen(false); }}>
            Buffotte
          </button>
          <a
            href="/HeZhili_CV.pdf"
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            CV
          </a>
          <a
            href="https://github.com/Shr1mpTop"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            GitHub
          </a>
        </div>
      )}
    </nav>
  );
}
