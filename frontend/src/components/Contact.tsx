import { useState } from "react";
import axios from "axios";

function Contact() {
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/contact/feedback", {
        feedback,
        email,
      });
      setMessage(response.data.message);
      setFeedback("");
      setEmail("");
    } catch (error) {
      setMessage("发送失败，请稍后再试");
    }
    setLoading(false);
  };

  return (
    <div className="contact">
      <h1>联系我</h1>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="email">邮箱 (可选)</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="feedback">反馈内容</label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            rows={10}
            placeholder="请输入您的反馈或问题..."
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "发送中..." : "发送反馈"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default Contact;
