import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useLocation } from "react-router-dom";

function NewPostPage() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [formValues, setFormValues] = useState({});
  const inputCls =
    "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 outline-none transition-colors focus:border-[#fece51] focus:bg-gray-50";
  const highlightedInputCls =
    "border-[#fece51]/50 bg-[#fece51]/5 focus:bg-[#fece51]/5";

  const navigate = useNavigate();
  const location = useLocation();

  // Restore form data if coming back from images page
  useEffect(() => {
    const savedData = location.state?.propertyData;
    if (savedData) {
      setFormValues({
        title: savedData.postData.title,
        price: savedData.postData.price,
        address: savedData.postData.address,
        city: savedData.postData.city,
        bedroom: savedData.postData.bedroom,
        bathroom: savedData.postData.bathroom,
        type: savedData.postData.type,
        property: savedData.postData.property,
        latitude: savedData.postData.latitude,
        longitude: savedData.postData.longitude,
        size: savedData.postDetail.size,
        income: savedData.postDetail.income,
        school: savedData.postDetail.school,
        bus: savedData.postDetail.bus,
        restaurant: savedData.postDetail.restaurant,
        utilities: savedData.postDetail.utilities,
        pet: savedData.postDetail.pet,
      });
      setValue(savedData.postDetail.desc);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    // Validate required fields
    if (!inputs.bedroom || parseInt(inputs.bedroom) < 1) {
      setError("Please enter at least 1 bedroom.");
      return;
    }
    if (!inputs.bathroom || parseInt(inputs.bathroom) < 1) {
      setError("Please enter at least 1 bathroom.");
      return;
    }

    // Prepare property data and navigate to images page
    const propertyData = {
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
    };

    // Navigate to images upload page
    navigate("/add/images", { state: { propertyData } });
  };

  // Form fields configuration
  const formFields = [
    {id:'title',label:'Property Title',type:'text',placeholder:'Enter property title',required:true,colSpan:'md:col-span-2'},
    {id:'price',label:'Price (₹)',type:'number',required:true},
    {id:'address',label:'Address',type:'text',placeholder:'Enter property address',required:true},
    {id:'city',label:'City',type:'text',placeholder:'Enter city',required:true},
    {id:'bedroom',label:'Bedrooms',type:'number',min:1,placeholder:'Number of bedrooms',required:true, highlight: true},
    {id:'bathroom',label:'Bathrooms',type:'number',min:1,placeholder:'Number of bathrooms',required:true, highlight: true},
    {id:'size',label:'Total Size (sqft)',type:'number',min:0,placeholder:'Property size',required:true},
    {id:'income',label:'Income Policy',type:'text',placeholder:'Income requirements',required:true},
    {id:'school',label:'Distance to School (m)',type:'number',min:0,placeholder:'Distance to nearest school',required:true},
    {id:'bus',label:'Distance to Bus (m)',type:'number',min:0,placeholder:'Distance to nearest bus stop',required:true},
    {id:'restaurant',label:'Distance to Restaurant (m)',type:'number',min:0,placeholder:'Distance to nearest restaurant',required:true},
    {id:'latitude',label:'Latitude',type:'text',placeholder:'Property latitude',required:true},
    {id:'longitude',label:'Longitude',type:'text',placeholder:'Property longitude',required:true},
  ];

  const selectFields = [
    {id:'type',label:'Listing Type',opts:[{v:'buy',l:'Buy'},{v:'rent',l:'Rent'}]},
    {id:'property',label:'Property Type',opts:[{v:'apartment',l:'Apartment'},{v:'house',l:'House'},{v:'condo',l:'Condo'},{v:'land',l:'Land'}]},
    {id:'utilities',label:'Utilities Policy',opts:[{v:'owner',l:'Owner is responsible'},{v:'tenant',l:'Tenant is responsible'},{v:'shared',l:'Shared'}]},
    {id:'pet',label:'Pet Policy',opts:[{v:'allowed',l:'Allowed'},{v:'not-allowed',l:'Not Allowed'}]}
  ];

  return (
    <div className="min-h-[calc(100vh-100px)] bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-[#fece51] rounded-full flex items-center justify-center text-[#1a1a1a] font-bold text-sm">1</span>
              <span className="text-[#1a1a1a] font-semibold">Property Details</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm">2</span>
              <span className="text-gray-400">Upload Images</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-10">
          <h1 className="text-2xl font-playfair font-bold text-[#040404] mb-2">Add New Property</h1>
          <p className="text-gray-500 mb-8">Fill in the property details. You'll upload images in the next step.</p>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formFields.map(f => (
              <div key={f.id} className={f.colSpan || ''}>
                <label htmlFor={f.id} className="block text-sm text-gray-600 mb-1">
                  {f.label}
                  {f.highlight && <span className="ml-1 text-[#fece51] text-xs">(determines image count)</span>}
                </label>
                <input 
                  id={f.id} 
                  name={f.id} 
                  type={f.type} 
                  placeholder={f.placeholder} 
                  required={f.required} 
                  min={f.min}
                  defaultValue={formValues[f.id] || ''}
                  className={`${inputCls} ${
                    f.highlight ? highlightedInputCls : ""
                  }`} 
                />
              </div>
            ))}
            {selectFields.map(s => (
              <div key={s.id}>
                <label htmlFor={s.id} className="block text-sm text-gray-600 mb-1">{s.label}</label>
                <select 
                  id={s.id} 
                  name={s.id} 
                  required 
                  defaultValue={formValues[s.id] || s.opts[0].v}
                  className={inputCls}
                >
                  {s.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
                </select>
              </div>
            ))}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-600 mb-1">Description</label>
              <ReactQuill theme="snow" onChange={setValue} value={value} />
            </div>
            
            {/* Info Box */}
            <div className="md:col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-blue-800 text-sm font-medium">Image Requirements</p>
                  <p className="text-blue-600 text-xs mt-1">
                    In the next step, you'll need to upload: 1 Hall/Living Room image (cover), 1 Kitchen image,
                    plus 1 image for each bedroom and 1 image for each bathroom you specified above.
                  </p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#fece51] to-[#f0b400] text-white font-semibold rounded-lg border-none cursor-pointer hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                Continue to Upload Images
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              {error && <span className="block text-sm text-red-500 text-center mt-3">{error}</span>}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default NewPostPage;
