import { useState } from "react";

function Slider({ images }) {
  const [imageIndex, setImageIndex] = useState(null);

  const changeSlide = (direction) => {
    if (direction === "left") {
      if (imageIndex === 0) {
        setImageIndex(images.length - 1);
      } else {
        setImageIndex(imageIndex - 1);
      }
    } else {
      if (imageIndex === images.length - 1) {
        setImageIndex(0);
      } else {
        setImageIndex(imageIndex + 1);
      }
    }
  };

  return (
    <div className="w-full h-[350px] flex gap-5">
      {imageIndex !== null && (
        <div className="fixed inset-0 bg-black flex justify-between items-center z-[9999]">
          <div className="flex-1 flex items-center justify-center cursor-pointer" onClick={() => changeSlide("left")}>
            <img src="/arrow.png" alt="" className="w-[50px]" />
          </div>
          <div className="flex-[10]">
            <img src={images[imageIndex]} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 flex items-center justify-center cursor-pointer" onClick={() => changeSlide("right")}>
            <img src="/arrow.png" alt="" className="w-[50px] rotate-180" />
          </div>
          <div
            className="absolute top-0 right-0 text-white text-4xl font-bold p-12 cursor-pointer"
            onClick={() => setImageIndex(null)}
          >
            X
          </div>
        </div>
      )}
      <div className="flex-[3]">
        <img src={images[0]} alt="" className="w-full h-full object-cover rounded-[10px] cursor-pointer" onClick={() => setImageIndex(0)} />
      </div>
      <div className="flex-1 flex flex-col justify-between gap-5">
        {images.slice(1).map((image, index) => (
          <img
            src={image}
            alt=""
            key={index}
            className="w-full h-[100px] object-cover rounded-[10px] cursor-pointer"
            onClick={() => setImageIndex(index + 1)}
          />
        ))}
      </div>
    </div>
  );
}

export default Slider;
