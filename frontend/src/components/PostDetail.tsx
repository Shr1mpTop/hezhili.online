import { useEffect, useState } from "react";
import axios from "axios";
import { marked } from "marked";
import hljs from "highlight.js";

interface PostDetailProps {
  post: any;
  onNavigate: (view: string) => void;
}

function PostDetail({ post, onNavigate }: PostDetailProps) {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (post) {
      // Render markdown
      const rendered = marked(post.content);
      setContent(rendered);

      // Highlight code blocks
      setTimeout(() => {
        document.querySelectorAll("pre code").forEach((block) => {
          hljs.highlightElement(block as HTMLElement);
        });
      }, 100);
    }
  }, [post]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-detail">
      <button onClick={() => onNavigate("blog")} className="back-btn">
        ← 返回博客
      </button>
      <h1>{post.title}</h1>
      <div className="post-meta">
        <span>{new Date(post.date).toLocaleDateString()}</span>
        <div className="tags">
          {post.tags.map((tag: string) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

export default PostDetail;
