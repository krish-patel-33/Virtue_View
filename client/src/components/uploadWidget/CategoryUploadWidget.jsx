import { useEffect, useState, useRef } from "react";
import "./CategoryUploadWidget.scss";

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
    <div className={`category-upload-widget ${currentImage ? 'has-image' : ''} ${isCover ? 'is-cover' : ''}`}>
      <div className="category-header">
        <div className="category-info">
          <span className="category-label">{label}</span>
          {isCover && <span className="cover-badge">Cover Image</span>}
        </div>
        <span className="category-description">{description}</span>
      </div>
      
      <div className="upload-area" onClick={handleClick}>
        {currentImage ? (
          <div className="image-preview">
            <img src={currentImage} alt={`${label} preview`} />
            <div className="image-overlay">
              <button className="change-btn" onClick={handleClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                Change
              </button>
              <button className="remove-btn" onClick={handleRemove}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <div className="upload-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <span className="upload-text">Click to upload {label.toLowerCase()} image</span>
            <span className="upload-hint">JPG, PNG or WEBP (max 5MB)</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryUploadWidget;
