import { useState, useCallback, lazy, Suspense } from "react";
import { useScrollProgress } from "./hooks/useScrollProgress";
import { getChapterIndex } from "./utils/cameraPath";
import ScrollContainer from "./components/Overlay/ScrollContainer";
import FloatingNav from "./components/Overlay/FloatingNav";
import OriginSection from "./components/Overlay/chapters/OriginSection";
import GenesisSection from "./components/Overlay/chapters/GenesisSection";
import ForgeSection from "./components/Overlay/chapters/ForgeSection";
import CreationsSection from "./components/Overlay/chapters/CreationsSection";
import JourneySection from "./components/Overlay/chapters/JourneySection";
import ConnectSection from "./components/Overlay/chapters/ConnectSection";
import "./App.css";

const ExperienceCanvas = lazy(
  () => import("./components/Experience/ExperienceCanvas"),
);
const BlogPanel = lazy(
  () => import("./components/Overlay/panels/BlogPanel"),
);
const PostDetailPanel = lazy(
  () => import("./components/Overlay/panels/PostDetailPanel"),
);
const BuffottePanel = lazy(
  () => import("./components/Overlay/panels/BuffottePanel"),
);

function App() {
  const scrollProgress = useScrollProgress();
  const activeChapter = getChapterIndex(scrollProgress);

  const [blogOpen, setBlogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [buffotteOpen, setBuffotteOpen] = useState(false);

  const handleBlogOpen = useCallback(() => setBlogOpen(true), []);
  const handleBuffotteOpen = useCallback(() => setBuffotteOpen(true), []);

  const handleSelectPost = useCallback((id: string) => {
    setSelectedPostId(id);
    setBlogOpen(false);
  }, []);

  return (
    <div className="app">
      <Suspense fallback={null}>
        <ExperienceCanvas scrollProgress={scrollProgress} />
      </Suspense>
      <FloatingNav
        activeChapter={activeChapter}
        onBlogOpen={handleBlogOpen}
        onBuffotteOpen={handleBuffotteOpen}
      />
      <ScrollContainer>
        <OriginSection />
        <GenesisSection />
        <ForgeSection />
        <CreationsSection />
        <JourneySection />
        <ConnectSection />
      </ScrollContainer>
      <Suspense fallback={null}>
        <BlogPanel
          isOpen={blogOpen}
          onClose={() => setBlogOpen(false)}
          onSelectPost={handleSelectPost}
        />
        <PostDetailPanel
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
        <BuffottePanel
          isOpen={buffotteOpen}
          onClose={() => setBuffotteOpen(false)}
        />
      </Suspense>
    </div>
  );
}

export default App;
