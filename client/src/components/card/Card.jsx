import { Link, useNavigate } from "react-router-dom";

// Format price in Indian Rupee format (e.g., ₹1,00,000)
const formatIndianPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

function Card({ item, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this property?")) {
      onDelete(item.id);
    }
  };

  const handleCardClick = () => {
    navigate(`/${item.id}`);
  };

  const handleIconClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-[0_4px_15px_rgba(0,0,0,0.1)] transition-all duration-300 h-full flex flex-col min-h-[450px] cursor-pointer hover:-translate-y-[5px] hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)]"
      onClick={handleCardClick}
    >
      <div className="relative h-[280px] overflow-hidden">
        <img src={item.images[0]} alt="" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
      </div>
      <div className="p-[25px] flex-1 flex flex-col gap-5">
        <h2 className="text-[1.3rem] font-semibold text-[#2c3e50] m-0 leading-[1.4]">
          <Link to={`/${item.id}`} className="text-inherit no-underline transition-colors hover:text-[#B8860B]" onClick={(e) => e.stopPropagation()}>
            {item.title}
          </Link>
        </h2>
        <p className="flex items-center gap-2 text-gray-500 text-base">
          <img src="/pin.png" alt="" className="w-4 h-4 opacity-70" />
          <span>{item.address}</span>
        </p>
        <p className="text-[1.4rem] font-bold text-[#B8860B] m-0">{formatIndianPrice(item.price)}</p>
        <div className="mt-auto flex justify-between items-center pt-5 border-t border-gray-100">
          <div className="flex gap-5">
            <div className="flex items-center gap-2 text-gray-500">
              <img src="/bed.png" alt="" className="w-5 h-5 opacity-70" />
              <span>{item.bedroom}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <img src="/bath.png" alt="" className="w-5 h-5 opacity-70" />
              <span>{item.bathroom}</span>
            </div>
          </div>
          <div className="flex gap-3" onClick={handleIconClick}>
            <div className="w-[35px] h-[35px] rounded-full bg-gray-100 flex items-center justify-center cursor-pointer transition-all hover:bg-[#B8860B] group">
              <img src="/save.png" alt="" className="w-[18px] h-[18px] transition-all group-hover:brightness-0 group-hover:invert" />
            </div>
            {onDelete && (
              <div
                className="w-[35px] h-[35px] rounded-full bg-gray-100 flex items-center justify-center cursor-pointer transition-all hover:bg-red-500 group"
                onClick={handleDelete}
                title="Delete Property"
              >
                <img src="/delete.png" alt="" className="w-[18px] h-[18px] transition-all group-hover:brightness-0 group-hover:invert" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;

