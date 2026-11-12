import { useState, useEffect } from "react";
import { marked } from "marked";
import "highlight.js/styles/github-dark.css";

interface Props {
  postId: string | null;
  onClose: () => void;
}

export default function PostDetailPanel({ postId, onClose }: Props) {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    if (!postId) return;
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts/${postId}`);
        const data = await res.json();
        setPost(data);
        setLikes(data.likes || 0);
        setLiked(data.liked_by?.includes("anonymous") || false);

        const cRes = await fetch(`/api/posts/${postId}/comments`);
        const cData = await cRes.json();
        setComments(cData);
      } catch {
        setPost(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleLike = async () => {
    if (!postId) return;
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "anonymous" }),
      });
      const data = await res.json();
      setLiked(data.hasLiked);
      setLikes(data.likes);
    } catch {}
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId || !commentText.trim()) return;
    if (commentText.length > 2000) {
      setCommentError("评论最长 2000 字");
      return;
    }
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: commentAuthor.trim() || "Anonymous",
          content: commentText.trim(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const msg =
          body?.detail?.[0]?.msg || body?.detail || `提交失败（${res.status}）`;
        setCommentError(typeof msg === "string" ? msg : JSON.stringify(msg));
        return;
      }
      setCommentError("");
      setCommentText("");
      const cRes = await fetch(`/api/posts/${postId}/comments`);
      setComments(await cRes.json());
    } catch {
      setCommentError("网络错误，请重试");
    }
  };

  const isOpen = !!postId;

  return (
    <div className={`panel-overlay ${isOpen ? "open" : ""}`}>
      <div className="panel-content terminal-panel">
        <div className="panel-header">
          <button className="panel-close" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className="panel-body">
          {loading && <p className="terminal-line">Loading post...</p>}
          {!loading && post && (
            <>
              <h1 className="post-title">{post.title}</h1>
              <div className="post-meta">
                <span>{new Date(post.date).toLocaleDateString("zh-CN")}</span>
                <button type="button" onClick={handleLike}>
                  {liked ? "♥" : "♡"} {likes}
                </button>
              </div>
              <div
                className="post-content markdown-body"
                dangerouslySetInnerHTML={{
                  __html: marked(post.content || ""),
                }}
              />

              <div className="comments-section">
                <h3>Comments ({comments.length})</h3>
                {comments.map((c: any, i: number) => (
                  <div key={i} className="comment">
                    <strong>{c.author}</strong>
                    <p>{c.content}</p>
                    <span className="comment-date">
                      {new Date(c.date).toLocaleDateString("zh-CN")}
                    </span>
                  </div>
                ))}

                <form className="comment-form" onSubmit={handleComment}>
                  <input
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    placeholder="Name (optional)"
                  />
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                    maxLength={2000}
                  />
                  {commentError && (
                    <p className="comment-error">{commentError}</p>
                  )}
                  <button type="submit">Submit</button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
