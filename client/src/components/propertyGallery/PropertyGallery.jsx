import { useEffect, useState } from "react";

const PropertyGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    setSelectedImage(0);
  }, [images]);

  useEffect(() => {
    if (!images || images.length <= 1) return undefined;

    const interval = setInterval(() => {
      setSelectedImage((current) => (current + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-lg text-gray-500 text-lg">
        No images available
      </div>
    );
  }

  const showPrevious = () => {
    setSelectedImage((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const showNext = () => {
    setSelectedImage((current) => (current + 1) % images.length);
  };

  return (
    <div className="w-full mb-8">
      <div className="relative w-full h-[500px] mb-4 rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <img
          src={images[selectedImage]}
          alt={`Property view ${selectedImage + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
              aria-label="Previous image"
            >
              <span className="text-2xl leading-none">&#8249;</span>
            </button>

            <button
              type="button"
              onClick={showNext}
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
              aria-label="Next image"
            >
              <span className="text-2xl leading-none">&#8250;</span>
            </button>

            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/30 px-3 py-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    selectedImage === index ? "bg-white" : "bg-white/45"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                ></button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 px-2">
        {images.map((image, index) => (
          <button
            key={index}
            type="button"
            className={`aspect-square rounded overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] border-2 ${
              selectedImage === index ? "border-blue-500" : "border-transparent"
            }`}
            onClick={() => setSelectedImage(index)}
            aria-label={`Open thumbnail ${index + 1}`}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PropertyGallery;
