import { useEffect, useState } from "react";
import "./Home.css";

type BootLine = {
  text: string;
  delay: number;
  type?: "success";
};

const bootSequence: BootLine[] = [
  { text: "> BIOS POST check...", delay: 100 },
  {
    text: "[OK] CPU: Intel Core i9-13900K @ 5.8GHz",
    delay: 80,
    type: "success",
  },
  { text: "[OK] RAM: 64GB DDR5-6400", delay: 60, type: "success" },
  { text: "[OK] GPU: RTX 4090 24GB GDDR6X", delay: 60, type: "success" },
  { text: "[OK] Storage: 2TB NVMe SSD", delay: 60, type: "success" },
  { text: "> Initializing kernel...", delay: 100 },
  { text: "> Loading system modules...", delay: 80 },
  { text: "[OK] Network stack initialized", delay: 50, type: "success" },
  { text: "[OK] Security protocols active", delay: 50, type: "success" },
  { text: "[OK] Firewall enabled", delay: 50, type: "success" },
  { text: "> Decrypting user profile...", delay: 120 },
  { text: "[OK] Identity verified: HE ZHILI", delay: 100, type: "success" },
  { text: "[OK] Permissions granted: ADMIN", delay: 80, type: "success" },
  { text: "", delay: 50 },
  { text: "> Launching portfolio interface...", delay: 150 },
  { text: "[READY] System online", delay: 100, type: "success" },
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function Home() {
  const [bootLines, setBootLines] = useState<BootLine[]>([]);
  const [showAscii, setShowAscii] = useState(false);
  const [showMotto, setShowMotto] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let unmounted = false;
    let glitchTimer: ReturnType<typeof setInterval> | null = null;
    const fullMotto = '"Audentes fortuna iuvat"';

    const run = async () => {
      for (const line of bootSequence) {
        await sleep(line.delay);
        if (unmounted) return;
        setBootLines((prev) => [...prev, line]);
      }

      await sleep(300);
      if (unmounted) return;
      setShowAscii(true);

      await sleep(600);
      if (unmounted) return;
      setShowMotto(true);

      for (let i = 0; i <= fullMotto.length; i++) {
        if (unmounted) return;
        setTypedText(fullMotto.slice(0, i));
        await sleep(60 + Math.random() * 40);
      }

      await sleep(400);
      if (unmounted) return;
      setShowSubtitle(true);

      await sleep(500);
      if (unmounted) return;
      glitchTimer = setInterval(
        () => {
          setGlitchActive(Math.random() > 0.7);
          setTimeout(() => setGlitchActive(false), 50 + Math.random() * 100);
        },
        2000 + Math.random() * 3000,
      );
    };

    run();

    return () => {
      unmounted = true;
      if (glitchTimer) clearInterval(glitchTimer);
    };
  }, []);

  return (
    <div className="home-page">
      <div className="terminal-container">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <span className="term-btn close"></span>
            <span className="term-btn minimize"></span>
            <span className="term-btn maximize"></span>
          </div>
          <div className="terminal-title">hezhili@portfolio: ~/welcome</div>
          <div className="terminal-status">
            <span className="status-dot"></span>
            <span>CONNECTED</span>
          </div>
        </div>

        <div className="terminal-body">
          <div className="boot-sequence">
            {bootLines.map((line, index) => (
              <div
                key={index}
                className={`boot-line ${line.type === "success" ? "success" : ""}`}
              >
                {line.text}
              </div>
            ))}
          </div>

          {showAscii && (
            <div className={`ascii-section ${glitchActive ? "glitch" : ""}`}>
              <pre className="ascii-art">{`██╗  ██╗███████╗    ███████╗██╗  ██╗██╗██╗     ██╗
██║  ██║██╔════╝    ╚══███╔╝██║  ██║██║██║     ██║
███████║█████╗        ███╔╝ ███████║██║██║     ██║
██╔══██║██╔══╝       ███╔╝  ██╔══██║██║██║     ██║
██║  ██║███████╗    ███████╗██║  ██║██║███████╗██║
╚═╝  ╚═╝╚══════╝    ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚═╝`}</pre>
              <div className="ascii-subtitle">
                <span className="bracket">[</span>
                <span className="role">Full-Stack Developer</span>
                <span className="separator">|</span>
                <span className="role">AI Enthusiast</span>
                <span className="separator">|</span>
                <span className="role">Blockchain Explorer</span>
                <span className="bracket">]</span>
              </div>
            </div>
          )}

          {showMotto && (
            <div className="motto-section">
              <div className="motto-container">
                <span className="motto-prompt">&gt;</span>
                <span className="motto-text">{typedText}</span>
                <span
                  className={`cursor ${typedText.length >= 23 ? "blink" : ""}`}
                >
                  _
                </span>
              </div>
              {showSubtitle && (
                <div className="motto-translation">
                  <span className="comment-prefix">//</span>
                  <span className="translation-text">命运眷顾勇敢之人</span>
                </div>
              )}
            </div>
          )}

          {showSubtitle && (
            <>
              <div className="decorative-code">
                <div className="code-line">
                  <span className="keyword">const</span>{" "}
                  <span className="variable">developer</span> ={" "}
                  <span className="brace">{"{"}</span>
                </div>
                <div className="code-line indent">
                  <span className="property">name</span>:{" "}
                  <span className="string">"He Zhili"</span>,
                </div>
                <div className="code-line indent">
                  <span className="property">location</span>:{" "}
                  <span className="string">"NTU, Singapore"</span>,
                </div>
                <div className="code-line indent">
                  <span className="property">passion</span>: [
                  <span className="string">"AI"</span>,{" "}
                  <span className="string">"Web3"</span>,{" "}
                  <span className="string">"Full-Stack"</span>],
                </div>
                <div className="code-line indent">
                  <span className="property">status</span>:{" "}
                  <span className="string">"Ready to innovate"</span>
                </div>
                <div className="code-line">
                  <span className="brace">{"}"}</span>;
                </div>
              </div>

              <div className="nav-hint">
                <span className="hint-icon">◄</span>
                <span className="hint-text">Use sidebar to navigate</span>
                <span className="hint-icon">►</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="corner-decoration top-left">&lt;/&gt;</div>
      <div className="corner-decoration top-right">{"{ }"}</div>
      <div className="corner-decoration bottom-left">[ ]</div>
      <div className="corner-decoration bottom-right">( )</div>
    </div>
  );
}

export default Home;
