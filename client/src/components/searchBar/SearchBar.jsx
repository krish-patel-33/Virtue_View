import { useState } from "react";
import { useNavigate } from "react-router-dom";

const popularCities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad"];

function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
  });
  const [focused, setFocused] = useState("");

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("type", "buy");
    if (query.city) params.set("city", query.city);
    if (query.minPrice) params.set("minPrice", query.minPrice);
    if (query.maxPrice) params.set("maxPrice", query.maxPrice);
    navigate(`/list?${params.toString()}`);
  };

  const handleCityTag = (city) => {
    setQuery((prev) => ({ ...prev, city }));
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Main Search Card */}
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">

        {/* Input Fields */}
        <form onSubmit={handleSearch} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-3">

            {/* Location */}
            <div
              className={`flex-[2] flex items-center gap-3 bg-white/10 border rounded-2xl px-4 py-3 transition-all duration-200 ${
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
                  placeholder="City, area or landmark"
                  onChange={handleChange}
                  onFocus={() => setFocused("city")}
                  onBlur={() => setFocused("")}
                  className="bg-transparent border-none outline-none text-white font-poppins text-sm placeholder-white/40 w-full"
                />
              </div>
            </div>

            {/* Min Price */}
            <div
              className={`flex-1 flex items-center gap-3 bg-white/10 border rounded-2xl px-4 py-3 transition-all duration-200 ${
                focused === "minPrice"
                  ? "border-[#fece51] bg-white/15 shadow-[0_0_0_3px_rgba(254,206,81,0.15)]"
                  : "border-white/15 hover:border-white/30"
              }`}
            >
              <svg className="w-5 h-5 text-[#fece51] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex flex-col w-full">
                <label className="text-white/50 text-[11px] font-poppins font-medium uppercase tracking-wider mb-0.5">Min Price</label>
                <input
                  type="number"
                  name="minPrice"
                  value={query.minPrice}
                  min={0}
                  placeholder="₹ No min"
                  onChange={handleChange}
                  onFocus={() => setFocused("minPrice")}
                  onBlur={() => setFocused("")}
                  className="bg-transparent border-none outline-none text-white font-poppins text-sm placeholder-white/40 w-full"
                />
              </div>
            </div>

            {/* Max Price */}
            <div
              className={`flex-1 flex items-center gap-3 bg-white/10 border rounded-2xl px-4 py-3 transition-all duration-200 ${
                focused === "maxPrice"
                  ? "border-[#fece51] bg-white/15 shadow-[0_0_0_3px_rgba(254,206,81,0.15)]"
                  : "border-white/15 hover:border-white/30"
              }`}
            >
              <svg className="w-5 h-5 text-[#fece51] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex flex-col w-full">
                <label className="text-white/50 text-[11px] font-poppins font-medium uppercase tracking-wider mb-0.5">Max Price</label>
                <input
                  type="number"
                  name="maxPrice"
                  value={query.maxPrice}
                  min={0}
                  placeholder="₹ No max"
                  onChange={handleChange}
                  onFocus={() => setFocused("maxPrice")}
                  onBlur={() => setFocused("")}
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
