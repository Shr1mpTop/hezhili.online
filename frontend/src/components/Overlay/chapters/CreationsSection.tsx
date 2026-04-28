import { useMemo, useState, useEffect } from "react";
import ChapterSection from "../ChapterSection";
import GlassCard from "../../shared/GlassCard";

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

export default function CreationsSection() {
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
        if (!response.ok)
          throw new Error(`GitHub API 请求失败: ${response.status}`);
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
    <ChapterSection id="creations" label="04 / Creations">
      <h2 className="chapter-title animate-in">Projects That Ship</h2>

      <div className="hero-stats animate-in">
        <div>
          <span>Repos</span>
          <strong>{repos.length}</strong>
        </div>
        <div>
          <span>Stars</span>
          <strong>{totalStars}</strong>
        </div>
        <div>
          <span>Source</span>
          <strong>@Shr1mpTop</strong>
        </div>
      </div>

      <div className="featured-grid animate-in">
        {featuredDeployments.map((item) => (
          <GlassCard key={item.name} onClick={() => openInNewTab(item.url)}>
            <span className="pill">{item.tag}</span>
            <h3>{item.name}</h3>
            <p>{item.summary}</p>
          </GlassCard>
        ))}
      </div>

      <div className="repo-toolbar animate-in">
        <h3>GitHub Repositories</h3>
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

      {loading && <p className="state-text animate-in">Loading repositories...</p>}
      {error && <p className="state-text error animate-in">{error}</p>}

      {!loading && !error && (
        <div className="repo-grid animate-in">
          {visibleRepos.map((repo) => (
            <GlassCard key={repo.id} className="repo-card">
              <div className="repo-head">
                <h4>{repo.name}</h4>
                <span>★ {repo.stargazers_count}</span>
              </div>
              <p>{repo.description || "No description."}</p>
              <div className="repo-meta">
                <span>{repo.language || "Unknown"}</span>
                <span>{new Date(repo.updated_at).toLocaleDateString("zh-CN")}</span>
              </div>
              <div className="repo-actions">
                <button type="button" onClick={() => openInNewTab(repo.html_url)}>
                  Source
                </button>
                {repo.homepage && (
                  <button type="button" onClick={() => openInNewTab(repo.homepage)}>
                    Demo
                  </button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </ChapterSection>
  );
}
