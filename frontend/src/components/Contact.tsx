import { useEffect, useState } from "react";
import "./Contact.css";

function Contact() {
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [terminalLines, setTerminalLines] = useState<
    Array<{ text: string; type?: string }>
  >([]);
  const [showForm, setShowForm] = useState(false);
  const [showAscii, setShowAscii] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);

  const bootSequence = [
    { text: "> Booting secure terminal...", delay: 200 },
    { text: "> Loading kernel modules...", delay: 150 },
    { text: "[OK] Core modules loaded", delay: 100, type: "success" },
    { text: "> Initializing network interface...", delay: 200 },
    { text: "[OK] Network online (IPv4/IPv6)", delay: 100, type: "success" },
    { text: "> Establishing secure channel...", delay: 300 },
    { text: "[OK] TLS 1.3 handshake complete", delay: 100, type: "success" },
    {
      text: "[OK] Certificate verified: hezhili.online",
      delay: 100,
      type: "success",
    },
    { text: "", delay: 100 },
    {
      text: "[READY] Terminal online - awaiting input...",
      delay: 200,
      type: "success",
    },
  ];

  const asciiArt = ` ██████╗ ██████╗ ███╗   ██╗████████╗ █████╗  ██████╗████████╗
██╔════╝██╔═══██╗████╗  ██║╚══██╔══╝██╔══██╗██╔════╝╚══██╔══╝
██║     ██║   ██║██╔██╗ ██║   ██║   ███████║██║        ██║
██║     ██║   ██║██║╚██╗██║   ██║   ██╔══██║██║        ██║
╚██████╗╚██████╔╝██║ ╚████║   ██║   ██║  ██║╚██████╗   ██║
 ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝   ╚═╝`;

  useEffect(() => {
    let unmounted = false;
    let glitchInterval: ReturnType<typeof setInterval> | null = null;

    const run = async () => {
      for (const line of bootSequence) {
        await new Promise((resolve) => setTimeout(resolve, line.delay));
        if (unmounted) return;
        setTerminalLines((prev) => [...prev, line]);
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
      if (unmounted) return;
      setShowAscii(true);

      await new Promise((resolve) => setTimeout(resolve, 500));
      if (unmounted) return;
      setShowForm(true);

      glitchInterval = setInterval(
        () => {
          setGlitchActive(true);
          setTimeout(() => setGlitchActive(false), 100);
        },
        4000 + Math.random() * 3000,
      );
    };

    run();

    return () => {
      unmounted = true;
      if (glitchInterval) clearInterval(glitchInterval);
    };
  }, []);

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const sendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedback.trim()) {
      setErrorMessage("ERROR: Message buffer is empty");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    if (!isAnonymous && email && !validateEmail(email)) {
      setErrorMessage("ERROR: Invalid email format detected");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    setIsLoading(true);
    setShowError(false);

    try {
      const response = await fetch("/api/contact/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feedback: feedback.trim(),
          email: isAnonymous ? null : email.trim(),
        }),
      });

      const result = await response.json();
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
        setFeedback("");
        setEmail("");
        setIsAnonymous(true);
      } else {
        setErrorMessage(result.error || "TRANSMISSION_FAILED: Retry later");
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch {
      setErrorMessage("CONNECTION_ERROR: Network unreachable");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }

    setIsLoading(false);
  };

  return (
    <div className="contact-page">
      <div className="terminal-container">
        <div className="terminal-header">
          <div className="terminal-buttons">
            <span className="term-btn close"></span>
            <span className="term-btn minimize"></span>
            <span className="term-btn maximize"></span>
          </div>
          <div className="terminal-title">
            visitor@hezhili.online: ~/contact
          </div>
          <div className="terminal-status">
            <span className="status-dot"></span>
            <span>SECURE</span>
          </div>
        </div>

        <div className="terminal-body">
          <div className="boot-sequence">
            {terminalLines.map((line, index) => (
              <div
                key={index}
                className={`terminal-line ${line.type === "success" ? "success-line" : ""}`}
              >
                {line.text && <span className="line-content">{line.text}</span>}
              </div>
            ))}
          </div>

          {showAscii && (
            <div className={`ascii-section ${glitchActive ? "glitch" : ""}`}>
              <pre className="ascii-art">{asciiArt}</pre>
            </div>
          )}

          {showForm && (
            <form className="form-section" onSubmit={sendFeedback}>
              <div className="motto-section">
                <div className="motto-text">"Audentes fortuna iuvat"</div>
                <div className="motto-translation">// 命运眷顾勇敢之人</div>
              </div>

              <div className="input-group">
                <div className="input-label">
                  <span className="prompt">visitor@hezhili:~$</span>
                  <span className="command">nano message.txt</span>
                </div>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="terminal-textarea"
                  placeholder="Enter your message here..."
                  rows={6}
                  disabled={isLoading}
                ></textarea>
                <div className="input-footer">
                  <span className="char-indicator">
                    {feedback.length}/5000 bytes
                  </span>
                </div>
              </div>

              <div className="identity-section">
                <div className="identity-toggle">
                  <button
                    type="button"
                    className={`mode-btn ${isAnonymous ? "active" : ""}`}
                    onClick={() => {
                      setIsAnonymous(true);
                      setEmail("");
                    }}
                    disabled={isLoading}
                  >
                    <span className="mode-icon">👤</span>
                    <span>匿名发送</span>
                  </button>
                  <button
                    type="button"
                    className={`mode-btn ${!isAnonymous ? "active" : ""}`}
                    onClick={() => setIsAnonymous(false)}
                    disabled={isLoading}
                  >
                    <span className="mode-icon">📧</span>
                    <span>留下邮箱</span>
                  </button>
                </div>
              </div>

              {!isAnonymous && (
                <div className="email-section">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="terminal-input"
                    placeholder="your@email.com"
                    disabled={isLoading}
                  />
                </div>
              )}

              <div className="submit-section">
                <button
                  className="transmit-btn"
                  type="submit"
                  disabled={isLoading || !feedback.trim()}
                >
                  {isLoading ? "发送中..." : "发送反馈"}
                </button>
              </div>

              {showSuccess && (
                <div className="status-message success">
                  <span className="status-prefix">[SUCCESS]</span>
                  <span>
                    Transmission complete. Thank you for your feedback.
                  </span>
                </div>
              )}

              {showError && (
                <div className="status-message error">
                  <span className="status-prefix">[ERROR]</span>
                  <span>{errorMessage}</span>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;
