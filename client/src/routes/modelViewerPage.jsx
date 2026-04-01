import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function ModelViewerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Use default model or specific model based on property
  const modelUrl = "/floorplan.glb";

  const toggleFullscreen = () => {
    const elem = document.getElementById("model-container");
    if (!document.fullscreenElement) {
      elem.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/30 backdrop-blur-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-[#fece51] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span className="font-medium">Back</span>
        </button>
        
        <h1 className="text-xl font-bold text-white font-playfair">3D Floor Plan Viewer</h1>
        
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-2 px-4 py-2 bg-[#fece51] text-[#1a1a2e] rounded-lg font-medium hover:bg-[#f0b400] transition-colors"
        >
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          )}
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </button>
      </div>

      {/* 3D Viewer Container */}
      <div id="model-container" className="relative w-full h-[calc(100vh-72px)]">
        <iframe
          src={`/model-viewer.html?model=${encodeURIComponent(modelUrl)}`}
          title="3D Model Viewer"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />

        {/* Controls overlay */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-black/50 backdrop-blur-md rounded-full">
          <div className="flex items-center gap-2 text-white text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
            </svg>
            <span>Drag to rotate</span>
          </div>
          <div className="w-px h-4 bg-white/30"></div>
          <div className="flex items-center gap-2 text-white text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
            </svg>
            <span>Scroll to zoom</span>
          </div>
          <div className="w-px h-4 bg-white/30"></div>
          <div className="flex items-center gap-2 text-white text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
            </svg>
            <span>Right-click to pan</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModelViewerPage;
