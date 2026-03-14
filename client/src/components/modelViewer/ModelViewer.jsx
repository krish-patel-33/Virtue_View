import { useEffect, useRef, useState } from 'react';

function ModelViewer({ modelUrl }) {
  const iframeRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  const iframeSrc = modelUrl
    ? `/model-viewer.html?model=${encodeURIComponent(modelUrl)}`
    : "/model-viewer.html";

  // Handle iframe resize on window resize
  useEffect(() => {
    const handleResize = () => {
      if (iframeRef.current) {
        // Force iframe to reload on resize to ensure proper rendering
        const currentSrc = iframeRef.current.src;
        iframeRef.current.src = '';
        setTimeout(() => {
          if (iframeRef.current) {
            iframeRef.current.src = currentSrc;
          }
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Send zoom message to iframe
  useEffect(() => {
    const sendZoomMessage = () => {
      if (iframeRef.current && iframeRef.current.contentWindow) {
        iframeRef.current.contentWindow.postMessage({
          type: 'zoom',
          value: zoomLevel
        }, '*');
      }
    };

    // Send zoom message when zoom level changes
    sendZoomMessage();
  }, [zoomLevel]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  return (
    <div className="w-full h-[400px] bg-[#f5f5f5] rounded-lg overflow-hidden mb-5 shadow-[0_2px_4px_rgba(0,0,0,0.1)] relative">
      {!modelUrl ? (
        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
          <svg className="w-10 h-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
          <span className="text-sm font-poppins">No 3D model available</span>
        </div>
      ) : (
        <>
          <div className="absolute right-4 bottom-4 flex flex-col gap-2 z-10">
            <button
              onClick={handleZoomIn}
              className="w-9 h-9 rounded-full bg-[#fece51] text-white border-none shadow-[0_2px_5px_rgba(0,0,0,0.2)] flex items-center justify-center cursor-pointer transition-all text-lg font-bold color-[#333] hover:bg-[#e6b847] hover:scale-105 active:scale-95"
            >
              <span className="leading-none">+</span>
            </button>
            <button
              onClick={handleZoomOut}
              className="w-9 h-9 rounded-full bg-[#ff8a65] text-white border-none shadow-[0_2px_5px_rgba(0,0,0,0.2)] flex items-center justify-center cursor-pointer transition-all text-lg font-bold hover:bg-[#e67a55] hover:scale-105 active:scale-95"
            >
              <span className="leading-none">−</span>
            </button>
          </div>
          <iframe
            ref={iframeRef}
            src={iframeSrc}
            title="3D Model Viewer"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </>
      )}
    </div>
  );
}

export default ModelViewer; 