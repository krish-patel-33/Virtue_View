import { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import CategoryUploadWidget from "../../components/uploadWidget/CategoryUploadWidget";

function PropertyImagesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const propertyData = location.state?.propertyData;

  const [hallImage, setHallImage] = useState(null);
  const [kitchenImage, setKitchenImage] = useState(null);
  const [bedroomImages, setBedroomImages] = useState([]);
  const [bathroomImages, setBathroomImages] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Floor plan state
  const [floorPlanFile, setFloorPlanFile] = useState(null);
  const [modelUrl, setModelUrl] = useState("");
  const [modelStatus, setModelStatus] = useState("idle");
  const [modelError, setModelError] = useState("");

  // Redirect if no property data
  useEffect(() => {
    if (!propertyData) {
      navigate("/add");
    } else {
      // Initialize image arrays based on bedroom/bathroom count
      setBedroomImages(new Array(propertyData.postData.bedroom).fill(null));
      setBathroomImages(new Array(propertyData.postData.bathroom).fill(null));
    }
  }, [propertyData, navigate]);

  // Handle hall image upload
  const handleHallUpload = useCallback((category, imageUrl) => {
    setHallImage(imageUrl);
  }, []);

  // Handle kitchen image upload
  const handleKitchenUpload = useCallback((category, imageUrl) => {
    setKitchenImage(imageUrl);
  }, []);

  // Handle bedroom image upload
  const handleBedroomUpload = useCallback((index, imageUrl) => {
    setBedroomImages(prev => {
      const updated = [...prev];
      updated[index] = imageUrl;
      return updated;
    });
  }, []);

  // Handle bathroom image upload
  const handleBathroomUpload = useCallback((index, imageUrl) => {
    setBathroomImages(prev => {
      const updated = [...prev];
      updated[index] = imageUrl;
      return updated;
    });
  }, []);

  // Check if all required images are uploaded
  const allImagesUploaded = () => {
    if (!hallImage) return false;
    if (!kitchenImage) return false;
    if (bedroomImages.some(img => img === null)) return false;
    if (bathroomImages.some(img => img === null)) return false;
    return true;
  };

  // Get count of uploaded images
  const getUploadedCount = () => {
    let count = hallImage ? 1 : 0;
    count += kitchenImage ? 1 : 0;
    count += bedroomImages.filter(Boolean).length;
    count += bathroomImages.filter(Boolean).length;
    return count;
  };

  // Get total required images
  const getTotalRequired = () => {
    if (!propertyData) return 0;
    return 2 + propertyData.postData.bedroom + propertyData.postData.bathroom; // hall + kitchen + bedrooms + bathrooms
  };

  // Handle 3D model generation
  const handleGenerateModel = async () => {
    if (!floorPlanFile) return;
    setModelStatus("uploading");
    setModelUrl("");
    setModelError("");
    try {
      const fd = new FormData();
      fd.append("floorPlan", floorPlanFile);
      const res = await apiRequest.post("/convert", fd);
      setModelUrl(res.data.modelUrl);
      setModelStatus("done");
    } catch (err) {
      console.error(err);
      setModelError(err.response?.data?.message || "Conversion failed");
      setModelStatus("error");
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setError("");
    
    if (!allImagesUploaded()) {
      setError("Please upload all required images before creating the listing.");
      return;
    }

    setIsSubmitting(true);

    // Compile all images: hall first, then kitchen, then bedrooms, then bathrooms
    const allImages = [
      hallImage,
      kitchenImage,
      ...bedroomImages,
      ...bathroomImages
    ];

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          ...propertyData.postData,
          images: allImages,
          ...(modelUrl && { modelUrl }),
        },
        postDetail: propertyData.postDetail,
      });
      navigate("/" + res.data.id);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate("/add", { state: { propertyData } });
  };

  if (!propertyData) {
    return null;
  }

  const bedroomCount = propertyData.postData.bedroom;
  const bathroomCount = propertyData.postData.bathroom;

  return (
    <div className="min-h-[calc(100vh-100px)] bg-[#1a1a1a] p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-white/60 hover:text-white mb-4 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Property Details
          </button>
          <h1 className="text-3xl font-playfair font-bold text-white mb-2">Upload Property Images</h1>
          <p className="text-white/60">
            Upload images for your property listing. All images are required.
          </p>
        </div>

        {/* Property Summary */}
        <div className="bg-white/5 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">Property Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-white/50">Title:</span>
              <p className="text-white font-medium truncate">{propertyData.postData.title}</p>
            </div>
            <div>
              <span className="text-white/50">Price:</span>
              <p className="text-white font-medium">₹{propertyData.postData.price.toLocaleString()}</p>
            </div>
            <div>
              <span className="text-white/50">Bedrooms:</span>
              <p className="text-[#fece51] font-medium">{bedroomCount}</p>
            </div>
            <div>
              <span className="text-white/50">Bathrooms:</span>
              <p className="text-[#fece51] font-medium">{bathroomCount}</p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-between bg-white/5 rounded-lg px-6 py-4 mb-8">
          <span className="text-white/70">Images uploaded:</span>
          <span className={`font-semibold ${allImagesUploaded() ? 'text-green-400' : 'text-[#fece51]'}`}>
            {getUploadedCount()} / {getTotalRequired()}
          </span>
        </div>

        {/* Hall/Living Room Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#fece51] rounded-full flex items-center justify-center text-[#1a1a1a] font-bold text-sm">1</span>
            Hall / Living Room
            <span className="text-xs bg-[#fece51] text-[#1a1a1a] px-2 py-0.5 rounded-full font-bold">COVER IMAGE</span>
          </h3>
          <CategoryUploadWidget
            uwConfig={{ cloudName: "dhruvik4561", uploadPreset: "estate" }}
            category="hall"
            label="Hall"
            description="Main living room / hall area - This will be used as the cover photo"
            isCover={true}
            currentImage={hallImage}
            onImageUpload={handleHallUpload}
          />
        </div>

        {/* Kitchen Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#fece51] rounded-full flex items-center justify-center text-[#1a1a1a] font-bold text-sm">2</span>
            Kitchen
          </h3>
          <CategoryUploadWidget
            uwConfig={{ cloudName: "dhruvik4561", uploadPreset: "estate" }}
            category="kitchen"
            label="Kitchen"
            description="Kitchen / cooking area of the property"
            isCover={false}
            currentImage={kitchenImage}
            onImageUpload={handleKitchenUpload}
          />
        </div>

        {/* Bedrooms Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#fece51] rounded-full flex items-center justify-center text-[#1a1a1a] font-bold text-sm">3</span>
            Bedrooms ({bedroomCount} {bedroomCount === 1 ? 'image' : 'images'} required)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bedroomImages.map((image, index) => (
              <CategoryUploadWidget
                key={`bedroom-${index}`}
                uwConfig={{ cloudName: "dhruvik4561", uploadPreset: "estate" }}
                category={`bedroom-${index}`}
                label={`Bedroom ${index + 1}`}
                description={`Upload image for bedroom ${index + 1}`}
                isCover={false}
                currentImage={image}
                onImageUpload={(_, url) => handleBedroomUpload(index, url)}
              />
            ))}
          </div>
        </div>

        {/* Bathrooms Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-[#fece51] rounded-full flex items-center justify-center text-[#1a1a1a] font-bold text-sm">4</span>
            Bathrooms ({bathroomCount} {bathroomCount === 1 ? 'image' : 'images'} required)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {bathroomImages.map((image, index) => (
              <CategoryUploadWidget
                key={`bathroom-${index}`}
                uwConfig={{ cloudName: "dhruvik4561", uploadPreset: "estate" }}
                category={`bathroom-${index}`}
                label={`Bathroom ${index + 1}`}
                description={`Upload image for bathroom ${index + 1}`}
                isCover={false}
                currentImage={image}
                onImageUpload={(_, url) => handleBathroomUpload(index, url)}
              />
            ))}
          </div>
        </div>

        {/* Floor Plan → 3D Model */}
        <div className="mb-8 bg-white/5 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
            <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
            </span>
            3D Model from Floor Plan
            <span className="text-xs bg-white/20 text-white/70 px-2 py-0.5 rounded-full font-medium">OPTIONAL</span>
          </h3>
          <p className="text-white/50 text-sm mb-4 ml-10">
            Upload a floor plan image (PNG/JPG) to auto-generate a 3D walkthrough model.
          </p>

          {/* File picker */}
          <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/20 rounded-xl px-4 py-6 cursor-pointer hover:border-[#fece51]/50 transition-colors group">
            <svg className="w-8 h-8 text-white/30 group-hover:text-[#fece51]/60 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <span className="text-white/50 text-xs text-center group-hover:text-white/70 transition-colors">
              {floorPlanFile ? floorPlanFile.name : "Click to select floor plan image"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                setFloorPlanFile(e.target.files[0] || null);
                setModelStatus("idle");
                setModelUrl("");
              }}
            />
          </label>

          {/* Generate button */}
          {floorPlanFile && modelStatus !== "done" && (
            <button
              type="button"
              onClick={handleGenerateModel}
              disabled={modelStatus === "uploading"}
              className="mt-3 w-full py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-[#fece51] to-[#f0b400] text-[#1a1a1a] font-semibold rounded-xl text-sm border-none cursor-pointer hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
            >
              {modelStatus === "uploading" ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Generating 3D Model...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                  Generate 3D Model
                </>
              )}
            </button>
          )}

          {/* Status messages */}
          {modelStatus === "done" && (
            <div className="mt-3 flex items-center gap-2 bg-green-500/15 border border-green-500/30 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-green-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-400 text-xs font-medium">3D model generated successfully!</span>
            </div>
          )}
          {modelStatus === "error" && (
            <div className="mt-3 flex items-center gap-2 bg-red-500/15 border border-red-500/30 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-red-400 text-xs">{modelError || "Conversion failed. Please check your Gemini API key and ensure the image is a clear floor plan."}</span>
            </div>
          )}
        </div>

        {/* Submit Section */}
        <div className="bg-white/5 rounded-xl p-6">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !allImagesUploaded()}
            className="w-full py-4 bg-gradient-to-r from-[#fece51] to-[#f0b400] text-[#1a1a1a] font-bold rounded-xl text-lg border-none cursor-pointer hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {isSubmitting ? "Creating Property Listing..." : "Create Property Listing"}
          </button>
          {!allImagesUploaded() && (
            <p className="text-center text-white/50 text-sm mt-3">
              Please upload all {getTotalRequired()} required images to continue
            </p>
          )}
          {error && <span className="block text-sm text-red-400 text-center mt-3">{error}</span>}
        </div>
      </div>
    </div>
  );
}

export default PropertyImagesPage;
