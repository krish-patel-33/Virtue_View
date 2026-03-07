import { useState } from "react";

const PropertyGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return <div className="w-full h-[300px] flex items-center justify-center bg-gray-50 rounded-lg text-gray-500 text-lg">No images available</div>;
  }

  return (
    <div className="w-full mb-8">
      <div className="w-full h-[500px] mb-4 rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
        <img
          src={images[selectedImage]}
          alt={`Property view ${selectedImage + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
        />
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4 px-2">
        {images.map((image, index) => (
          <div
            key={index}
            className={`aspect-square rounded overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] border-2 ${
              selectedImage === index ? 'border-blue-500' : 'border-transparent'
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyGallery; 