import { useState } from "react";
import ChapterSection from "../ChapterSection";

export default function ConnectSection() {
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const sendFeedback = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedback.trim()) {
      setErrorMessage("Message cannot be empty");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    if (!isAnonymous && email && !validateEmail(email)) {
      setErrorMessage("Invalid email format");
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
        setErrorMessage(result.error || "Transmission failed");
        setShowError(true);
        setTimeout(() => setShowError(false), 3000);
      }
    } catch {
      setErrorMessage("Network error");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }

    setIsLoading(false);
  };

  return (
    <ChapterSection id="connect" label="06 / Connect">
      <h2 className="chapter-title animate-in">Let's Build Something</h2>

      <form className="connect-form animate-in" onSubmit={sendFeedback}>
        <div className="form-group">
          <label>Message</label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Your message..."
            rows={5}
            disabled={isLoading}
          />
          <span className="char-count">{feedback.length}/5000</span>
        </div>

        <div className="form-group identity-toggle">
          <button
            type="button"
            className={`mode-btn ${isAnonymous ? "active" : ""}`}
            onClick={() => {
              setIsAnonymous(true);
              setEmail("");
            }}
            disabled={isLoading}
          >
            Anonymous
          </button>
          <button
            type="button"
            className={`mode-btn ${!isAnonymous ? "active" : ""}`}
            onClick={() => setIsAnonymous(false)}
            disabled={isLoading}
          >
            Leave Email
          </button>
        </div>

        {!isAnonymous && (
          <div className="form-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>
        )}

        <button
          className="submit-btn"
          type="submit"
          disabled={isLoading || !feedback.trim()}
        >
          {isLoading ? "Sending..." : "Send Message"}
        </button>

        {showSuccess && (
          <div className="status-msg success">
            Message sent successfully. Thank you!
          </div>
        )}
        {showError && <div className="status-msg error">{errorMessage}</div>}
      </form>

      <div className="outro-links animate-in">
        <a href="https://github.com/Shr1mpTop" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href="/HeZhili_CV.pdf" target="_blank" rel="noopener noreferrer">
          Resume
        </a>
        <a href="/HeZhili_CV__English.pdf" target="_blank" rel="noopener noreferrer">
          CV (English)
        </a>
        <a href="mailto:HEZH0014@e.ntu.edu.sg">Email</a>
      </div>

      <div className="closing-motto animate-in">
        <span className="motto-quote">"</span>
        Audentes fortuna iuvat
        <span className="motto-quote">"</span>
      </div>
    </ChapterSection>
  );
}
