import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import "./Projects.css";

type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  homepage: string | null;
  fork: boolean;
};

const featuredDeployments = [
  {
    name: "Twikk",
    summary: "Web3 社交平台，支持 MetaMask 绑定与互动。",
    url: "https://twikk.hezhili.online",
    tag: "Live",
  },
  {
    name: "Buff Tracker",
    summary: "CS2 饰品市场价格查询与趋势追踪工具。",
    url: "https://bufftracker.hezhili.online/",
    tag: "Live",
  },
  {
    name: "hezhili.online",
    summary: "个人站点主工程，持续迭代中的前后端项目。",
    url: "https://github.com/Shr1mpTop/hezhili.online",
    tag: "Core",
  },
];

function Projects() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState("All");

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://api.github.com/users/Shr1mpTop/repos?per_page=100&sort=updated",
        );
        if (!response.ok) {
          throw new Error(`GitHub API 请求失败: ${response.status}`);
        }
        const data = (await response.json()) as Repo[];
        const usefulRepos = data
          .filter((repo) => !repo.fork)
          .sort(
            (a, b) =>
              b.stargazers_count - a.stargazers_count ||
              new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime(),
          );
        setRepos(usefulRepos);
      } catch (err: any) {
        setError(err?.message || "无法加载 GitHub 仓库列表");
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, []);

  const languageFilters = useMemo(() => {
    const set = new Set<string>();
    repos.forEach((repo) => {
      if (repo.language) set.add(repo.language);
    });
    return ["All", ...Array.from(set).sort()];
  }, [repos]);

  const visibleRepos = useMemo(() => {
    if (activeLang === "All") return repos.slice(0, 18);
    return repos.filter((repo) => repo.language === activeLang).slice(0, 18);
  }, [activeLang, repos]);

  const totalStars = useMemo(
    () => repos.reduce((sum, repo) => sum + repo.stargazers_count, 0),
    [repos],
  );

  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="projects-page">
      <section className="projects-hero">
        <p className="eyebrow">Shr1mpTop / Portfolio Modules</p>
        <h1>Projects That Actually Ship</h1>
        <p className="hero-subtitle">
          已重构为 GitHub
          动态项目墙，自动同步你的公开仓库，不再维护丑陋的硬编码卡片。
        </p>

        <div className="hero-stats">
          <div>
            <span>Public Repos</span>
            <strong>{repos.length}</strong>
          </div>
          <div>
            <span>Total Stars</span>
            <strong>{totalStars}</strong>
          </div>
          <div>
            <span>Source</span>
            <strong>@Shr1mpTop</strong>
          </div>
        </div>
      </section>

      <section className="featured-grid">
        {featuredDeployments.map((item) => (
          <motion.article
            key={item.name}
            className="featured-card"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => openInNewTab(item.url)}
          >
            <span className="pill">{item.tag}</span>
            <h3>{item.name}</h3>
            <p>{item.summary}</p>
          </motion.article>
        ))}
      </section>

      <section className="repo-panel">
        <div className="repo-toolbar">
          <h2>GitHub Repositories</h2>
          <div className="language-filters">
            {languageFilters.map((lang) => (
              <button
                key={lang}
                type="button"
                className={activeLang === lang ? "active" : ""}
                onClick={() => setActiveLang(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="state-text">正在加载 GitHub 项目...</p>}
        {!loading && error && <p className="state-text error">{error}</p>}

        {!loading && !error && (
          <div className="repo-grid">
            {visibleRepos.map((repo, index) => (
              <motion.article
                key={repo.id}
                className="repo-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03, duration: 0.28 }}
              >
                <div className="repo-head">
                  <h3>{repo.name}</h3>
                  <span>★ {repo.stargazers_count}</span>
                </div>
                <p>{repo.description || "暂无仓库描述。"}</p>
                <div className="repo-meta">
                  <span>{repo.language || "Unknown"}</span>
                  <span>
                    {new Date(repo.updated_at).toLocaleDateString("zh-CN")}
                  </span>
                </div>
                <div className="repo-actions">
                  <button
                    type="button"
                    onClick={() => openInNewTab(repo.html_url)}
                  >
                    Source
                  </button>
                  {repo.homepage && (
                    <button
                      type="button"
                      onClick={() => openInNewTab(repo.homepage as string)}
                    >
                      Demo
                    </button>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      <section className="projects-cta">
        <p>想看更多代码细节？直接访问你的 GitHub 主页。</p>
        <button
          type="button"
          onClick={() => openInNewTab("https://github.com/Shr1mpTop")}
        >
          Open GitHub Profile
        </button>
      </section>
      <div className="ambient-shape shape-a"></div>
      <div className="ambient-shape shape-b"></div>
      <div className="ambient-shape shape-c"></div>
    </div>
  );
}

export default Projects;
