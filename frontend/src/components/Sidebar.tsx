import { useEffect, useState } from "react";
import "./Sidebar.css";

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  onCollapsedChange?: (collapsed: boolean) => void;
}

type NavItem = {
  key: string;
  label: string;
  icon: string;
};

const navItems: NavItem[] = [
  { key: "home", label: "首页", icon: "01" },
  { key: "projects", label: "项目", icon: "02" },
  { key: "contact", label: "联系", icon: "03" },
];

function Sidebar({ activeView, onNavigate, onCollapsedChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    onCollapsedChange?.(isCollapsed);
  }, [isCollapsed, onCollapsedChange]);

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-top">
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="toggle-btn"
          type="button"
          aria-label="toggle sidebar"
        >
          {isCollapsed ? "→" : "←"}
        </button>
        {!isCollapsed && (
          <div className="brand-block">
            <div className="brand-title">HZL</div>
            <div className="brand-subtitle">Project Console</div>
          </div>
        )}
      </div>

      <nav className="menu" aria-label="main nav">
        {navItems.map((item) => (
          <button
            key={item.key}
            className={`menu-item ${activeView === item.key ? "active" : ""}`}
            onClick={() => onNavigate(item.key)}
            title={item.label}
            type="button"
          >
            <span className="menu-icon">{item.icon}</span>
            {!isCollapsed && <span className="menu-text">{item.label}</span>}
          </button>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="sidebar-footer">
          <a href="https://github.com/Shr1mpTop" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://bufftracker.hezhili.online/" target="_blank" rel="noopener noreferrer">
            Buff Tracker
          </a>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
