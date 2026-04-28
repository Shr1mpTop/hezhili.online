interface ProjectsProps {
  onNavigate: (view: string) => void;
}

function Projects({ onNavigate }: ProjectsProps) {
  return (
    <div className="projects">
      <h1>我的项目</h1>
      <p>项目展示页面。</p>
    </div>
  );
}

export default Projects;
