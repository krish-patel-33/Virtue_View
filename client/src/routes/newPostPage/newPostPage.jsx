import { useState, useCallback } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import CategoryUploadWidget from "../../components/uploadWidget/CategoryUploadWidget";
import { useNavigate } from "react-router-dom";

// Image categories configuration
const IMAGE_CATEGORIES = [
  { 
    key: "hall", 
    label: "Hall", 
    description: "Main living room / hall area",
    isCover: true 
  },
  { 
    key: "bedroom", 
    label: "Bedroom", 
    description: "Master bedroom or any bedroom" 
  },
  { 
    key: "bathroom", 
    label: "Bathroom", 
    description: "Bathroom / washroom area" 
  },
];

function NewPostPage() {
  const [value, setValue] = useState("");
  const [categoryImages, setCategoryImages] = useState({
    hall: null,
    bedroom: null,
    bathroom: null,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [floorPlanFile, setFloorPlanFile] = useState(null);
  const [modelUrl, setModelUrl] = useState("");
  const [modelStatus, setModelStatus] = useState("idle"); // idle | uploading | done | error

  const navigate = useNavigate();

  // Handle image upload for each category
  const handleImageUpload = useCallback((category, imageUrl) => {
    setCategoryImages(prev => ({
      ...prev,
      [category.toLowerCase()]: imageUrl,
    }));
  }, []);

  // Get images array with hall image first (as cover)
  const getImagesArray = () => {
    const images = [];
    // Hall image is first (cover image)
    if (categoryImages.hall) images.push(categoryImages.hall);
    if (categoryImages.bedroom) images.push(categoryImages.bedroom);
    if (categoryImages.bathroom) images.push(categoryImages.bathroom);
    return images;
  };

  // Check if at least the cover image (hall) is uploaded
  const hasMinimumImages = () => {
    return categoryImages.hall !== null;
  };

  const handleGenerateModel = async () => {
    if (!floorPlanFile) return;
    setModelStatus("uploading");
    setModelUrl("");
    try {
      const fd = new FormData();
      fd.append("floorPlan", floorPlanFile);
      const res = await apiRequest.post("/convert", fd);
      setModelUrl(res.data.modelUrl);
      setModelStatus("done");
    } catch (err) {
      console.error(err);
      setModelStatus("error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    // Validate that at least the cover image is uploaded
    if (!hasMinimumImages()) {
      setError("Please upload at least the Hall image (cover image) before creating the listing.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: getImagesArray(),
          ...(modelUrl && { modelUrl }),
        },
        postDetail: {
          desc: value,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
        },
      });
      navigate("/" + res.data.id);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputCls = "w-full px-3 py-2.5 border border-white/10 rounded-lg bg-white/5 text-white text-sm outline-none focus:border-[#fece51] transition-colors placeholder:text-white/40";
  const selectCls = `${inputCls} [color-scheme:dark]`;
  const labelCls = "block text-sm text-white/70 mb-1";

  return (
    <div className="flex h-[calc(100vh-100px)]">
      {/* Form */}
      <div className="flex-[3] bg-white p-10 overflow-y-auto">
        <h1 className="text-2xl font-playfair font-bold text-[#040404] mb-8">Add New Property</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {id:'title',label:'Property Title',type:'text',placeholder:'Enter property title',required:true,colSpan:'md:col-span-2'},
            {id:'price',label:'Price (₹)',type:'number',required:true},
            {id:'address',label:'Address',type:'text',placeholder:'Enter property address',required:true},
            {id:'city',label:'City',type:'text',placeholder:'Enter city',required:true},
            {id:'bedroom',label:'Bedrooms',type:'number',min:1,placeholder:'Number of bedrooms',required:true},
            {id:'bathroom',label:'Bathrooms',type:'number',min:1,placeholder:'Number of bathrooms',required:true},
            {id:'size',label:'Total Size (sqft)',type:'number',min:0,placeholder:'Property size',required:true},
            {id:'income',label:'Income Policy',type:'text',placeholder:'Income requirements',required:true},
            {id:'school',label:'Distance to School (m)',type:'number',min:0,placeholder:'Distance to nearest school',required:true},
            {id:'bus',label:'Distance to Bus (m)',type:'number',min:0,placeholder:'Distance to nearest bus stop',required:true},
            {id:'restaurant',label:'Distance to Restaurant (m)',type:'number',min:0,placeholder:'Distance to nearest restaurant',required:true},
            {id:'latitude',label:'Latitude',type:'text',placeholder:'Property latitude',required:true},
            {id:'longitude',label:'Longitude',type:'text',placeholder:'Property longitude',required:true},
          ].map(f => (
            <div key={f.id} className={f.colSpan || ''}>
              <label htmlFor={f.id} className="block text-sm text-gray-600 mb-1">{f.label}</label>
              <input id={f.id} name={f.id} type={f.type} placeholder={f.placeholder} required={f.required} min={f.min}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm outline-none focus:border-[#fece51] transition-colors" />
            </div>
          ))}
          {[{id:'type',label:'Listing Type',opts:[{v:'buy',l:'Buy'},{v:'rent',l:'Rent'}]},{id:'property',label:'Property Type',opts:[{v:'apartment',l:'Apartment'},{v:'house',l:'House'},{v:'condo',l:'Condo'},{v:'land',l:'Land'}]},{id:'utilities',label:'Utilities Policy',opts:[{v:'owner',l:'Owner is responsible'},{v:'tenant',l:'Tenant is responsible'},{v:'shared',l:'Shared'}]},{id:'pet',label:'Pet Policy',opts:[{v:'allowed',l:'Allowed'},{v:'not-allowed',l:'Not Allowed'}]}].map(s => (
            <div key={s.id}>
              <label htmlFor={s.id} className="block text-sm text-gray-600 mb-1">{s.label}</label>
              <select id={s.id} name={s.id} required className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-sm outline-none focus:border-[#fece51] transition-colors">
                {s.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">Description</label>
            <ReactQuill theme="snow" onChange={setValue} value={value} />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-[#fece51] to-[#f0b400] text-white font-semibold rounded-lg border-none cursor-pointer hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
            >
              {isSubmitting ? "Creating..." : "Create Property Listing"}
            </button>
            {error && <span className="block text-sm text-red-500 text-center mt-3">{error}</span>}
          </div>
        </form>
      </div>
      {/* Side images */}
      <div className="flex-[2] bg-[#1a1a1a] p-8 overflow-y-auto">
        <h2 className="text-xl font-playfair font-bold text-white mb-2">Property Images</h2>
        <p className="text-white/60 text-sm mb-6">
          Upload images for each room category. The Hall image will be used as the cover photo.
        </p>
        <div className="flex flex-col gap-5">
          {IMAGE_CATEGORIES.map((category) => (
            <CategoryUploadWidget
              key={category.key}
              uwConfig={{ cloudName: "dhruvik4561", uploadPreset: "estate" }}
              category={category.key}
              label={category.label}
              description={category.description}
              isCover={category.isCover}
              currentImage={categoryImages[category.key]}
              onImageUpload={handleImageUpload}
            />
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between bg-white/5 rounded-lg px-4 py-3">
          <span className="text-white/70 text-sm">Images uploaded:</span>
          <span className="text-[#fece51] font-semibold">
            {Object.values(categoryImages).filter(Boolean).length} / {IMAGE_CATEGORIES.length}
          </span>
        </div>

        {/* Floor Plan → 3D Model */}
        <div className="mt-8">
          <h3 className="text-base font-semibold text-white mb-1">3D Model from Floor Plan</h3>
          <p className="text-white/50 text-xs mb-4">
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
              <span className="text-red-400 text-xs">Conversion failed. Make sure the Python service is running and the image is a clear floor plan.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewPostPage;
