import { useState } from "react";
import Sidebar from "./components/Sidebar";
import MatrixBackground from "./components/MatrixBackground";
import Home from "./components/Home";
import Projects from "./components/Projects";
import BuffotteReport from "./components/BuffotteReport";
import About from "./components/About";
import Blog from "./components/Blog";
import PostDetail from "./components/PostDetail";
import Contact from "./components/Contact";
import "./App.css";

function App() {
  const [currentView, setCurrentView] = useState("home");
  const [selectedPost, setSelectedPost] = useState(null);

  const handleNavigate = (view: string, post?: any) => {
    setCurrentView(view);
    if (post) setSelectedPost(post);
  };

  const renderView = () => {
    switch (currentView) {
      case "home":
        return <Home />;
      case "projects":
        return <Projects onNavigate={handleNavigate} />;
      case "buffotte":
        return <BuffotteReport />;
      case "profile":
        return <About />;
      case "blog":
        return <Blog onNavigate={handleNavigate} />;
      case "blog-detail":
        return <PostDetail post={selectedPost} onNavigate={handleNavigate} />;
      case "contact":
        return <Contact />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app">
      <MatrixBackground />
      <Sidebar onNavigate={handleNavigate} />
      <main className="main-content">{renderView()}</main>
    </div>
  );
}

export default App;
