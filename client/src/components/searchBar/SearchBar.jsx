import { useState } from "react";
import { useNavigate } from "react-router-dom";

const popularCities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad"];

// Format number with Indian comma system (e.g., 1,00,000)
const formatIndianNumber = (num) => {
  if (!num) return "";
  const numStr = num.toString().replace(/,/g, "");
  if (isNaN(numStr)) return "";
  return new Intl.NumberFormat('en-IN').format(numStr);
};

// Remove commas to get raw number
const parseIndianNumber = (str) => {
  return str.replace(/,/g, "");
};

function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    bedroom: "",
    minPrice: "",
    maxPrice: "",
  });
  const [displayPrice, setDisplayPrice] = useState({
    minPrice: "",
    maxPrice: "",
  });
  const [focused, setFocused] = useState("");

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const rawValue = parseIndianNumber(value);
    
    // Only allow numbers
    if (rawValue && isNaN(rawValue)) return;
    
    // Update display value with formatting
    setDisplayPrice((prev) => ({ ...prev, [name]: formatIndianNumber(rawValue) }));
    // Update actual query value (raw number)
    setQuery((prev) => ({ ...prev, [name]: rawValue }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.type) params.set("type", query.type);
    if (query.city) params.set("city", query.city);
    if (query.bedroom) params.set("bedroom", query.bedroom);
    if (query.minPrice) params.set("minPrice", query.minPrice);
    if (query.maxPrice) params.set("maxPrice", query.maxPrice);
    navigate(`/list?${params.toString()}`);
  };

  const handleCityTag = (city) => {
    setQuery((prev) => ({ ...prev, city }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Card */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Buy/Rent Toggle */}
        <div className="flex border-b border-white/10">
          <button
            type="button"
            onClick={() => setQuery(prev => ({ ...prev, type: "buy" }))}
            className={`flex-1 py-4 text-sm font-poppins font-semibold transition-all duration-200 ${
              query.type === "buy"
                ? "bg-[#fece51] text-[#1a1a1a]"
                : "bg-transparent text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            Buy
          </button>
          <button
            type="button"
            onClick={() => setQuery(prev => ({ ...prev, type: "rent" }))}
            className={`flex-1 py-4 text-sm font-poppins font-semibold transition-all duration-200 ${
              query.type === "rent"
                ? "bg-[#fece51] text-[#1a1a1a]"
                : "bg-transparent text-white/70 hover:text-white hover:bg-white/5"
            }`}
          >
            Rent
          </button>
        </div>

        {/* Input Fields */}
        <form onSubmit={handleSearch} className="p-5 flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

            {/* Location */}
            <div
              className={`flex items-center gap-3 bg-white/10 border rounded-2xl px-4 py-3 transition-all duration-200 ${
                focused === "city"
                  ? "border-[#fece51] bg-white/15 shadow-[0_0_0_3px_rgba(254,206,81,0.15)]"
                  : "border-white/15 hover:border-white/30"
              }`}
            >
              <svg className="w-5 h-5 text-[#fece51] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="flex flex-col w-full">
                <label className="text-white/50 text-[11px] font-poppins font-medium uppercase tracking-wider mb-0.5">Location</label>
                <input
                  type="text"
                  name="city"
                  value={query.city}
                  placeholder="City or area"
                  autoComplete="off"
                  onChange={handleChange}
                  onFocus={() => setFocused("city")}
                  onBlur={() => setFocused("")}
                  className="bg-transparent border-none outline-none text-white font-poppins text-sm placeholder-white/40 w-full [&:-webkit-autofill]:bg-transparent [&:-webkit-autofill]:text-white [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s]"
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div
              className={`flex items-center gap-3 bg-white/10 border rounded-2xl px-4 py-3 transition-all duration-200 relative ${
                focused === "bedroom"
                  ? "border-[#fece51] bg-white/15 shadow-[0_0_0_3px_rgba(254,206,81,0.15)]"
                  : "border-white/15 hover:border-white/30"
              }`}
            >
              <svg className="w-5 h-5 text-[#fece51] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <div className="flex flex-col w-full">
                <label className="text-white/50 text-[11px] font-poppins font-medium uppercase tracking-wider mb-0.5">Bedrooms</label>
                <div className="relative">
                  <select
                    name="bedroom"
                    value={query.bedroom}
                    onChange={handleChange}
                    onFocus={() => setFocused("bedroom")}
                    onBlur={() => setFocused("")}
                    className="bg-transparent border-none outline-none text-white font-poppins text-sm w-full cursor-pointer appearance-none pr-6"
                  >
                    <option value="" style={{ backgroundColor: '#2d2d2d', color: 'white' }}>Any</option>
                    <option value="1" style={{ backgroundColor: '#2d2d2d', color: 'white' }}>1 BHK</option>
                    <option value="2" style={{ backgroundColor: '#2d2d2d', color: 'white' }}>2 BHK</option>
                    <option value="3" style={{ backgroundColor: '#2d2d2d', color: 'white' }}>3 BHK</option>
                    <option value="4" style={{ backgroundColor: '#2d2d2d', color: 'white' }}>4 BHK</option>
                    <option value="5" style={{ backgroundColor: '#2d2d2d', color: 'white' }}>5+ BHK</option>
                  </select>
                  <svg className="w-4 h-4 text-white/50 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Min Price */}
            <div
              className={`flex items-center gap-3 bg-white/10 border rounded-2xl px-4 py-3 transition-all duration-200 ${
                focused === "minPrice"
                  ? "border-[#fece51] bg-white/15 shadow-[0_0_0_3px_rgba(254,206,81,0.15)]"
                  : "border-white/15 hover:border-white/30"
              }`}
            >
              <svg className="w-5 h-5 text-[#fece51] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex flex-col w-full">
                <label className="text-white/50 text-[11px] font-poppins font-medium uppercase tracking-wider mb-0.5">Min Budget</label>
                <input
                  type="text"
                  name="minPrice"
                  value={displayPrice.minPrice}
                  placeholder="₹ No min"
                  onChange={handlePriceChange}
                  onFocus={() => setFocused("minPrice")}
                  onBlur={() => setFocused("")}
                  autoComplete="off"
                  className="bg-transparent border-none outline-none text-white font-poppins text-sm placeholder-white/40 w-full"
                />
              </div>
            </div>

            {/* Max Price */}
            <div
              className={`flex items-center gap-3 bg-white/10 border rounded-2xl px-4 py-3 transition-all duration-200 ${
                focused === "maxPrice"
                  ? "border-[#fece51] bg-white/15 shadow-[0_0_0_3px_rgba(254,206,81,0.15)]"
                  : "border-white/15 hover:border-white/30"
              }`}
            >
              <svg className="w-5 h-5 text-[#fece51] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex flex-col w-full">
                <label className="text-white/50 text-[11px] font-poppins font-medium uppercase tracking-wider mb-0.5">Max Budget</label>
                <input
                  type="text"
                  name="maxPrice"
                  value={displayPrice.maxPrice}
                  placeholder="₹ No max"
                  onChange={handlePriceChange}
                  onFocus={() => setFocused("maxPrice")}
                  onBlur={() => setFocused("")}
                  autoComplete="off"
                  className="bg-transparent border-none outline-none text-white font-poppins text-sm placeholder-white/40 w-full"
                />
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#fece51] to-[#f5a623] text-[#1a1a1a] font-poppins font-bold text-base py-4 rounded-2xl transition-all duration-200 hover:shadow-[0_8px_30px_rgba(254,206,81,0.4)] hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Properties
          </button>
        </form>
      </div>

      {/* Popular Cities */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <span className="text-white/50 text-xs font-poppins">Popular:</span>
        {popularCities.map((city) => (
          <button
            key={city}
            type="button"
            onClick={() => handleCityTag(city)}
            className={`text-xs font-poppins px-3 py-1.5 rounded-full border transition-all duration-150 ${
              query.city === city
                ? "bg-[#fece51] border-[#fece51] text-[#1a1a1a] font-semibold"
                : "bg-white/10 border-white/20 text-white/70 hover:bg-white/15 hover:text-white hover:border-white/30"
            }`}
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
