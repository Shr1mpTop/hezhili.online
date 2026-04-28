import { useState, useEffect } from "react";

type Post = {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  tags?: string[];
  likes: number;
  liked_by: string[];
  created_at: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectPost: (id: string) => void;
}

export default function BlogPanel({ isOpen, onClose, onSelectPost }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        setPosts(data);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [isOpen]);

  return (
    <div className={`panel-overlay ${isOpen ? "open" : ""}`}>
      <div className="panel-content terminal-panel">
        <div className="panel-header">
          <h2>Blog</h2>
          <button className="panel-close" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className="panel-body">
          {loading && <p className="terminal-line">Loading posts...</p>}
          {!loading && posts.length === 0 && (
            <p className="terminal-line">No posts yet.</p>
          )}
          {!loading &&
            posts.map((post) => (
              <article
                key={post._id}
                className="blog-entry"
                onClick={() => onSelectPost(post._id)}
              >
                <h3>{post.title}</h3>
                <p>{post.excerpt || post.content.slice(0, 120) + "..."}</p>
                <div className="blog-meta">
                  <span>♥ {post.likes}</span>
                  <span>{new Date(post.created_at).toLocaleDateString("zh-CN")}</span>
                </div>
              </article>
            ))}
        </div>
      </div>
    </div>
  );
}
