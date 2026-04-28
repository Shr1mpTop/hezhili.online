import "./Home.css";

function Home() {
  return (
    <div className="home">
      <div className="hero">
        <h1 className="title">HeZhili</h1>
        <p className="subtitle">Full Stack Developer & Tech Enthusiast</p>
        <div className="description">
          <p>欢迎来到我的个人网站！</p>
          <p>这里是我分享技术见解、项目经验和个人思考的地方。</p>
        </div>
      </div>
      <div className="features">
        <div className="feature-card">
          <h3>💻 技术博客</h3>
          <p>分享编程经验、教程和最新技术动态</p>
        </div>
        <div className="feature-card">
          <h3>🚀 项目展示</h3>
          <p>展示我的开源项目和个人作品</p>
        </div>
        <div className="feature-card">
          <h3>📧 联系交流</h3>
          <p>欢迎通过邮件或社交媒体与我交流</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
