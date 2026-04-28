import { useState, useEffect } from "react";
import axios from "axios";

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

  useEffect(() => {
    axios.get("/api/posts").then((response) => {
      setPosts(response.data);
    });
  }, []);

  return (
    <div className="blog">
      <h1>技术博客</h1>
      <div className="posts-list">
        {posts.map((post) => (
          <div
            key={post._id}
            className="post-card"
            onClick={() => onNavigate("blog-detail", post)}
          >
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <div className="post-meta">
              <span>{new Date(post.date).toLocaleDateString()}</span>
              <div className="tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blog;
