import { useEffect, useState, useRef } from "react";

function CategoryUploadWidget({ uwConfig, category, label, description, onImageUpload, currentImage, isCover }) {
  const [loaded, setLoaded] = useState(false);
  const widgetRef = useRef(null);

  useEffect(() => {
    // Check if the script is already loaded
    const uwScript = document.getElementById("uw");
    if (!uwScript) {
      // If not loaded, create and load the script
      const script = document.createElement("script");
      script.setAttribute("async", "");
      script.setAttribute("id", "uw");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.addEventListener("load", () => setLoaded(true));
      document.body.appendChild(script);
    } else if (window.cloudinary) {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (loaded && window.cloudinary) {
      try {
        widgetRef.current = window.cloudinary.createUploadWidget(
          {
            ...uwConfig,
            multiple: false, // Only single image per category
            folder: `posts/${category.toLowerCase()}`,
          },
          (error, result) => {
            if (!error && result && result.event === "success") {
              console.log(`${category} image uploaded:`, result.info.secure_url);
              onImageUpload(category, result.info.secure_url);
            }
          }
        );
      } catch (error) {
        console.error("Error creating upload widget:", error);
      }
    }
  }, [loaded, uwConfig, category, onImageUpload]);

  const handleClick = (e) => {
    e.preventDefault();
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onImageUpload(category, null);
  };

  return (
    <div className={`bg-[#2a2a2a] rounded-xl p-5 transition-all border-2 ${
      isCover ? 'border-[rgba(254,206,81,0.5)] bg-[rgba(254,206,81,0.08)]' : 'border-transparent hover:border-[rgba(254,206,81,0.3)]'
    }`}>
      <div className="mb-4">
        <div className="flex items-center gap-2.5 mb-1">
          <span className="text-[#fece51] text-lg font-semibold">{label}</span>
          {isCover && (
            <span className="bg-gradient-to-r from-[#fece51] to-[#f0b400] text-[#1a1a1a] px-2.5 py-0.5 rounded-xl text-[11px] font-bold uppercase tracking-wide">Cover Image</span>
          )}
        </div>
        <span className="text-gray-500 text-sm">{description}</span>
      </div>
      <div
        className={`border-2 border-dashed border-white/20 rounded-xl cursor-pointer overflow-hidden transition-all min-h-[180px] flex items-center justify-center hover:border-[#fece51] hover:bg-[rgba(254,206,81,0.05)] ${
          currentImage ? 'border-[rgba(254,206,81,0.5)]' : ''
        }`}
        onClick={handleClick}
      >
        {currentImage ? (
          <div className="relative w-full h-[180px] group">
            <img src={currentImage} alt={`${label} preview`} className="w-full h-full object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <button
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#fece51] to-[#f0b400] text-[#1a1a1a] border-none rounded-lg font-semibold cursor-pointer transition-all text-sm hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(254,206,81,0.4)]"
                onClick={handleClick}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                Change
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2.5 bg-white/10 text-red-400 border border-red-400/30 rounded-lg font-semibold cursor-pointer transition-all text-sm hover:bg-red-400/20 hover:-translate-y-0.5"
                onClick={handleRemove}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-[#fece51] mb-4 opacity-80">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            </div>
            <span className="text-white text-sm mb-1">Click to upload {label.toLowerCase()} image</span>
            <span className="text-gray-500 text-xs">JPG, PNG or WEBP (max 5MB)</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryUploadWidget;
