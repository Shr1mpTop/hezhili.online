import { useState } from "react";
import Sidebar from "./components/Sidebar";
import MatrixBackground from "./components/MatrixBackground";
import Home from "./components/Home";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case "home":
        return <Home />;
      case "projects":
        return <Projects />;
      case "contact":
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return (
    <div
      className="app"
      style={{
        ["--sidebar-width" as string]: sidebarCollapsed ? "50px" : "200px",
      }}
    >
      <MatrixBackground />
      <Sidebar
        activeView={currentView}
        onNavigate={handleNavigate}
        onCollapsedChange={setSidebarCollapsed}
      />
      <main className="main-content">{renderView()}</main>
    </div>
  );
}

export default App;
