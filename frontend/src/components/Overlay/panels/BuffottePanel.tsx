import { useState, useEffect } from "react";
import { marked } from "marked";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BuffottePanel({ isOpen, onClose }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/buffotte/report");
        const data = await res.json();
        setContent(data.report || data.content || "No report available.");
      } catch {
        setError("Failed to load Buffotte report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [isOpen]);

  return (
    <div className={`panel-overlay ${isOpen ? "open" : ""}`}>
      <div className="panel-content terminal-panel">
        <div className="panel-header">
          <h2>Buffotte Report</h2>
          <button className="panel-close" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className="panel-body">
          {loading && <p className="terminal-line">Fetching report...</p>}
          {error && <p className="terminal-line error-line">{error}</p>}
          {!loading && !error && (
            <div
              className="markdown-body"
              dangerouslySetInnerHTML={{ __html: marked(content) }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
