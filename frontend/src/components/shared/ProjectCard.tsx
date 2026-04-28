interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  homepage: string | null;
}

interface Props {
  repo: Repo;
}

export default function ProjectCard({ repo }: Props) {
  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <GlassCard className="project-card">
      <div className="project-card-head">
        <h3>{repo.name}</h3>
        <span className="project-stars">★ {repo.stargazers_count}</span>
      </div>
      <p className="project-desc">
        {repo.description || "No description."}
      </p>
      <div className="project-meta">
        <span className="project-lang">{repo.language || "Unknown"}</span>
        <span>{new Date(repo.updated_at).toLocaleDateString("zh-CN")}</span>
      </div>
      <div className="project-actions">
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
  );
}

function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`glass-card ${className}`}>{children}</div>;
}
