import { useEffect, useState } from "react";

function PropertyCardImage({ images = [], title = "Property", className = "" }) {
  const safeImages = images.length > 0 ? images : [];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  useEffect(() => {
    if (safeImages.length <= 1) return undefined;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % safeImages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [safeImages.length]);

  const showPrevious = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveIndex((current) =>
      current === 0 ? safeImages.length - 1 : current - 1
    );
  };

  const showNext = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setActiveIndex((current) => (current + 1) % safeImages.length);
  };

  if (safeImages.length === 0) {
    return (
      <div className={`flex h-full w-full flex-col items-center justify-center bg-gray-100 text-gray-400 ${className}`}>
        <i className="fas fa-image mb-2 text-3xl"></i>
        <span className="text-sm">No image available</span>
      </div>
    );
  }

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      <img
        src={safeImages[activeIndex]}
        alt={`${title} ${activeIndex + 1}`}
        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
      />

      {safeImages.length > 1 && (
        <>
          <button
            type="button"
            onClick={showPrevious}
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition-colors hover:bg-black/65"
            aria-label="Previous image"
          >
            <span className="text-lg leading-none">&#8249;</span>
          </button>

          <button
            type="button"
            onClick={showNext}
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition-colors hover:bg-black/65"
            aria-label="Next image"
          >
            <span className="text-lg leading-none">&#8250;</span>
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/35 px-2 py-1">
            {safeImages.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 w-1.5 rounded-full ${
                  index === activeIndex ? "bg-white" : "bg-white/45"
                }`}
              ></span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default PropertyCardImage;
