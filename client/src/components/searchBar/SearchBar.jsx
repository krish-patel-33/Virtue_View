import { useState } from "react";
import { Link } from "react-router-dom";

const types = ["buy"];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "buy",
    city: "",
    minPrice: 0,
    maxPrice: 0,
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="w-full max-w-[800px] mx-auto bg-white/10 backdrop-blur-[10px] rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-[rgba(255,215,0,0.2)] transition-all hover:-translate-y-0.5">
      <div className="flex gap-3 mb-4 justify-center">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={`font-poppins px-6 py-3 rounded-xl font-medium text-base min-w-[120px] transition-all ${
              query.type === type
                ? 'bg-white/15 text-[#FFD700] border-b-2 border-[#FFD700]'
                : 'bg-white/10 text-white/90 hover:bg-white/15 hover:text-[#FFD700]'
            }`}
          >
            {type}
          </button>
        ))}
      </div>
      <form className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2 border border-[rgba(255,215,0,0.1)]">
        <div className="flex-1 flex items-center gap-2 p-2 border-r border-[rgba(255,215,0,0.1)]">
          <span className="text-xl text-[#FFD700]">📍</span>
          <input type="text" name="city" placeholder="Enter location" onChange={handleChange}
            className="w-full bg-transparent border-none outline-none text-white font-poppins text-base p-1 placeholder-white/50" />
        </div>
        <div className="flex-1 flex items-center gap-2 p-2 border-r border-[rgba(255,215,0,0.1)]">
          <span className="text-xl text-[#FFD700]">💰</span>
          <input type="number" name="minPrice" min={0} max={10000000} placeholder="Min Price" onChange={handleChange}
            className="w-full bg-transparent border-none outline-none text-white font-poppins text-base p-1 placeholder-white/50" />
        </div>
        <div className="flex-1 flex items-center gap-2 p-2">
          <span className="text-xl text-[#FFD700]">💰</span>
          <input type="number" name="maxPrice" min={0} max={10000000} placeholder="Max Price" onChange={handleChange}
            className="w-full bg-transparent border-none outline-none text-white font-poppins text-base p-1 placeholder-white/50" />
        </div>
        <Link to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}>
          <button className="flex items-center gap-2 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black border-none px-6 py-3 rounded-xl font-poppins font-semibold text-base cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(255,215,0,0.3)] whitespace-nowrap">
            <span className="text-xl">🔍</span>
            <span>Search</span>
          </button>
        </Link>
      </form>
    </div>
  );
}

export default SearchBar;
