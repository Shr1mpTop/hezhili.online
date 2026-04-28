import { useState } from "react";
import "./Sidebar.css";

interface SidebarProps {
  onNavigate: (view: string) => void;
}

function Sidebar({ onNavigate }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "首页", icon: "🏠" },
    { id: "profile", label: "关于", icon: "👤" },
    { id: "projects", label: "项目", icon: "💼" },
    { id: "blog", label: "博客", icon: "📝" },
    { id: "buffotte", label: "Buffotte", icon: "📊" },
    { id: "contact", label: "联系", icon: "📧" },
  ];

  return (
    <>
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h2>HeZhili</h2>
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            ×
          </button>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className="nav-item"
              onClick={() => {
                onNavigate(item.id);
                setIsOpen(false);
              }}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <button className="sidebar-toggle" onClick={() => setIsOpen(true)}>
        ☰
      </button>
    </>
  );
}

export default Sidebar;
