import { useState, useEffect } from "react";
import axios from "axios";
import "./Blog.css";

interface BlogProps {
  onNavigate: (view: string, post?: any) => void;
}

interface Post {
  _id: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
}

function Blog({ onNavigate }: BlogProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [terminalLines, setTerminalLines] = useState<
    Array<{ text: string; type?: "success" | "info" }>
  >([]);

  const bootSequence = [
    { text: "> Connecting to blog server...", delay: 200 },
    {
      text: "[OK] Connection established",
      delay: 150,
      type: "success" as const,
    },
    { text: "> Fetching latest posts...", delay: 200 },
    {
      text: "[INFO] Parsing markdown content...",
      delay: 100,
      type: "info" as const,
    },
    {
      text: "[OK] Database synchronized",
      delay: 150,
      type: "success" as const,
    },
    { text: "", delay: 50 },
    { text: "╔═════════════════════════════════════════════╗", delay: 30 },
    { text: "║                                             ║", delay: 30 },
    { text: "║   █▄▄ █   █▀█ █▀▀   █▀ █▄█ █▀ ▀█▀ █▀▀ █▀▄▀█ ║", delay: 30 },
    { text: "║   █▄█ █▄▄ █▄█ █▄█   ▄█ ░█░ ▄█ ░█░ ██▄ █░▀░█ ║", delay: 30 },
    { text: "║                                             ║", delay: 30 },
    { text: "╚═════════════════════════════════════════════╝", delay: 30 },
    { text: "", delay: 100 },
    {
      text: "[OK] Ready to display content",
      delay: 150,
      type: "success" as const,
    },
  ];

  useEffect(() => {
    let unmounted = false;

    const runBootAndFetch = async () => {
      for (const line of bootSequence) {
        await new Promise((resolve) => setTimeout(resolve, line.delay));
        if (unmounted) return;
        setTerminalLines((prev) => [
          ...prev,
          { text: line.text, type: line.type },
        ]);
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
      if (unmounted) return;
      setShowContent(true);

      try {
        const response = await axios.get("/api/posts");
        const sorted = [...response.data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        if (!unmounted) setPosts(sorted);
      } catch {
        if (!unmounted) {
          setPosts([
            {
              _id: "fallback-1",
              title: "没有成功连接上数据库",
              date: "8888-88-88",
              tags: ["error", "database", "Fatal"],
              excerpt: "请检查数据库连接是否正确，或者稍后再试。",
            },
          ]);
        }
      } finally {
        if (!unmounted) setLoading(false);
      }
    };

    runBootAndFetch();

    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <div className="blog-page">
      <div className="console integrated">
        <div className="console-header">
          <div className="header-left">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
            <div className="title">hezhili@portfolio: ~/blog</div>
          </div>
          <div className="header-status">
            <span className="status-indicator"></span>
            <span>ONLINE</span>
          </div>
        </div>

        {!showContent && (
          <div className="boot-sequence">
            {terminalLines.map((line, index) => (
              <div
                key={index}
                className={`terminal-line ${line.type === "success" ? "success-line" : ""} ${line.type === "info" ? "info-line" : ""}`}
              >
                {line.text && <span className="line-content">{line.text}</span>}
              </div>
            ))}
            <span className="boot-cursor">_</span>
          </div>
        )}

        {showContent && (
          <div className="console-content">
            <div className="panel">
              <h2>技术博客</h2>
              <p>分享我的技术学习心得、开发经验和行业洞察。</p>

              <div className="blog-posts">
                {loading && <div className="loading">加载中...</div>}
                {!loading &&
                  posts.map((post) => (
                    <div key={post._id} className="blog-post">
                      <h3>{post.title}</h3>
                      <div className="post-meta">
                        <span className="post-date">{post.date}</span>
                        <span className="post-tags">
                          {post.tags.join(", ")}
                        </span>
                      </div>
                      <p className="post-excerpt">{post.excerpt}</p>
                      <button
                        className="read-more-btn"
                        onClick={() => onNavigate("blog-detail", post)}
                      >
                        阅读更多
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Blog;
