import { useState, useCallback } from "react";
import "./newPostPage.scss";
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

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Property</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Property Title</label>
              <input id="title" name="title" type="text" placeholder="Enter property title" required />
            </div>
            <div className="item">
              <label htmlFor="price">Price (₹)</label>
              <input
                type="number"
                id="price"
                name="price"
                required
              />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" placeholder="Enter property address" required />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" placeholder="Enter city" required />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedrooms</label>
              <input min={1} id="bedroom" name="bedroom" type="number" placeholder="Number of bedrooms" required />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathrooms</label>
              <input min={1} id="bathroom" name="bathroom" type="number" placeholder="Number of bathrooms" required />
            </div>
            <div className="item">
              <label htmlFor="type">Listing Type</label>
              <select name="type" id="type" required>
                {/* <option value="rent">Rent</option> */}
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="property">Property Type</label>
              <select name="property" id="property" required>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" placeholder="Property size" required />
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities" id="utilities" required>
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet" id="pet" required>
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income requirements"
                required
              />
            </div>
            <div className="item">
              <label htmlFor="school">Distance to School (m)</label>
              <input min={0} id="school" name="school" type="number" placeholder="Distance to nearest school" required />
            </div>
            <div className="item">
              <label htmlFor="bus">Distance to Bus (m)</label>
              <input min={0} id="bus" name="bus" type="number" placeholder="Distance to nearest bus stop" required />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Distance to Restaurant (m)</label>
              <input min={0} id="restaurant" name="restaurant" type="number" placeholder="Distance to nearest restaurant" required />
            </div>
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" placeholder="Property latitude" required />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" placeholder="Property longitude" required />
            </div>
            <div className="item">
              <label htmlFor="desc">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            <button className="sendButton" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Property Listing"}
            </button>
            {error && <span className="error">{error}</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        <h2>Property Images</h2>
        <p className="imageInstructions">
          Upload images for each room category. The Hall image will be used as the cover photo.
        </p>
        
        <div className="categoryUploads">
          {IMAGE_CATEGORIES.map((category) => (
            <CategoryUploadWidget
              key={category.key}
              uwConfig={{
                cloudName: "dhruvik4561",
                uploadPreset: "estate",
              }}
              category={category.key}
              label={category.label}
              description={category.description}
              isCover={category.isCover}
              currentImage={categoryImages[category.key]}
              onImageUpload={handleImageUpload}
            />
          ))}
        </div>

        <div className="uploadSummary">
          <span className="summaryLabel">Images uploaded:</span>
          <span className="summaryCount">
            {Object.values(categoryImages).filter(Boolean).length} / {IMAGE_CATEGORIES.length}
          </span>
        </div>
      </div>
    </div>
  );
}

export default NewPostPage;
