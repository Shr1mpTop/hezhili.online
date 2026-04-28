import { useEffect, useState } from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import "./PostDetail.css";

interface PostDetailProps {
  post: any;
  onNavigate: (view: string) => void;
}

function PostDetail({ post, onNavigate }: PostDetailProps) {
  const [content, setContent] = useState("");
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!post) return;
    const rendered = marked(post.content || post.excerpt || "") as string;
    setContent(rendered);

    setTimeout(() => {
      document.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }, 100);
  }, [post]);

  useEffect(() => {
    if (!post?._id && !post?.id) return;

    const loadData = async () => {
      try {
        const id = post._id || post.id;
        const likeResponse = await fetch(`/api/posts/${id}`);
        if (likeResponse.ok) {
          const postData = await likeResponse.json();
          setLikes(postData.likes || 0);
          setHasLiked(postData.likedBy?.includes("guest") || false);
        }

        const commentResponse = await fetch(`/api/posts/${id}/comments`);
        if (commentResponse.ok) {
          setComments(await commentResponse.json());
        }
      } catch {
        setLikes(Math.floor(Math.random() * 50));
        setComments([
          {
            id: 1,
            author: "开发者A",
            content: "很棒的文章！学到了很多。",
            date: "2024-09-20",
          },
          {
            id: 2,
            author: "开发者B",
            content: "请问有相关的代码示例吗？",
            date: "2024-09-19",
          },
        ]);
      }
    };

    loadData();
  }, [post]);

  const toggleLike = async () => {
    const id = post?._id || post?.id;
    if (!id) return;

    try {
      const response = await fetch(`/api/posts/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "guest" }),
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
        setHasLiked(data.hasLiked);
        return;
      }
    } catch {
      // fallback below
    }

    setLikes((prev) => (hasLiked ? prev - 1 : prev + 1));
    setHasLiked((prev) => !prev);
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    const id = post?._id || post?.id;
    if (!id) return;

    try {
      const response = await fetch(`/api/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: "访客", content: newComment.trim() }),
      });
      if (response.ok) {
        const comment = await response.json();
        setComments((prev) => [comment, ...prev]);
      } else {
        throw new Error("failed");
      }
    } catch {
      setComments((prev) => [
        {
          id: Date.now(),
          author: "访客",
          content: newComment.trim(),
          date: new Date().toLocaleDateString(),
        },
        ...prev,
      ]);
    }

    setNewComment("");
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-detail-page">
      <div className="console integrated">
        <div className="console-header">
          <span className="console-prompt">
            hezhili@portfolio: ~/blog/{post.id || post._id}
          </span>
          <span className="console-cursor">_</span>
        </div>

        <div className="console-content">
          <div className="post-layout">
            <div className="post-content">
              <button className="back-btn" onClick={() => onNavigate("blog")}>
                ← 返回博客列表
              </button>
              <h1>{post.title}</h1>
              <div className="post-meta">
                <span className="post-date">{post.date}</span>
                <span className="post-tags">
                  {(post.tags || []).join(", ")}
                </span>
              </div>
              <div className="post-body">
                <div
                  className="markdown-content"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>

            <div className="post-sidebar">
              <div className="likes-section">
                <h3>点赞</h3>
                <div className="like-count">{likes} 赞</div>
                <button
                  className={`like-btn ${hasLiked ? "liked" : ""}`}
                  onClick={toggleLike}
                >
                  {hasLiked ? "已赞" : "点赞"}
                </button>
              </div>

              <div className="comments-section">
                <h3>评论 ({comments.length})</h3>
                <div className="comments-list">
                  {comments.map((comment) => (
                    <div key={comment._id || comment.id} className="comment">
                      <div className="comment-author">{comment.author}</div>
                      <div className="comment-content">{comment.content}</div>
                      <div className="comment-date">{comment.date}</div>
                    </div>
                  ))}
                </div>

                <div className="add-comment">
                  <input
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="写下你的评论..."
                    onKeyUp={(e) => {
                      if (e.key === "Enter") addComment();
                    }}
                  />
                  <button onClick={addComment}>发表评论</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
