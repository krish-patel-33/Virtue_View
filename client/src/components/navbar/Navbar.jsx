import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";
import apiRequest from "../../lib/apiRequest";

function Navbar() {

  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { currentUser, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  useEffect(() => {
    if (currentUser) fetch();
  }, [currentUser, fetch]);

  return (
    <nav className="h-[100px] flex justify-between items-center px-10 bg-[#040404] shadow-[0_2px_10px_rgba(0,0,0,0.2)] w-full relative z-[100] md:px-5">
      {/* Logo */}
      <div className="flex-1 flex items-center">
        <Link to="/" className="font-playfair font-bold text-[46px] flex items-center gap-4 bg-gradient-to-r from-[#B8860B] to-[#DAA520] bg-clip-text text-transparent italic tracking-wide hover:scale-105 transition-all duration-300">
          <img src="/logo.png" alt="" className="w-12 h-12 object-cover" />
          <span>VirtuView</span>
        </Link>
      </div>

      {/* Center links */}
      <div className="flex-[2] hidden md:flex items-center justify-center gap-[50px]">
        <Link to="/" className="text-white font-medium text-base py-2 hover:text-[#FFD700] transition-colors">Home</Link>
        <Link to="/properties" className="text-white font-medium text-base py-2 hover:text-[#FFD700] transition-colors">Properties</Link>
        <Link to="/about" className="text-white font-medium text-base py-2 hover:text-[#FFD700] transition-colors">About</Link>
        <Link to="/contact" className="text-white font-medium text-base py-2 hover:text-[#FFD700] transition-colors">Contact</Link>
        {currentUser && currentUser.userType === "seller" && (
          <Link to="/profile" className="text-white font-medium text-base py-2 hover:text-[#FFD700] transition-colors">My Properties</Link>
        )}
      </div>

      {/* Right actions */}
      <div className="flex-1 flex items-center justify-end h-full gap-2">
        {currentUser ? (
          <div className="relative flex items-center cursor-pointer" onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <img src={currentUser.avatar || "/noavatar.jpg"} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-[#FFD700]" />
            {number > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">{number}</span>
            )}
            {userMenuOpen && (
              <div className="absolute top-12 right-0 bg-white shadow-lg rounded-lg py-2 min-w-[150px] z-50">
                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-all">Profile</Link>
                <div onClick={handleLogout} className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer transition-all">Sign out</div>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link to="/login" className="text-white px-5 py-2 rounded-lg transition-all hover:text-[#FFD700]">Sign in</Link>
            <Link to="/register" className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black px-5 py-2 rounded-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(255,215,0,0.3)]">Sign up</Link>
          </>
        )}
        {/* Hamburger */}
        <div className="ml-3 cursor-pointer md:hidden" onClick={() => setOpen((prev) => !prev)}>
          <img src="/menu.png" alt="" className="w-6 h-6" />
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="absolute top-[100px] left-0 right-0 bg-[#040404] flex flex-col py-5 px-8 gap-4 z-50 md:hidden shadow-lg">
            <Link to="/" className="text-white hover:text-[#FFD700] transition-colors" onClick={() => setOpen(false)}>Home</Link>
            <Link to="/properties" className="text-white hover:text-[#FFD700] transition-colors" onClick={() => setOpen(false)}>Properties</Link>
            <Link to="/about" className="text-white hover:text-[#FFD700] transition-colors" onClick={() => setOpen(false)}>About</Link>
            <Link to="/contact" className="text-white hover:text-[#FFD700] transition-colors" onClick={() => setOpen(false)}>Contact</Link>
            {currentUser && currentUser.userType === "seller" && (
              <Link to="/profile" className="text-white hover:text-[#FFD700] transition-colors" onClick={() => setOpen(false)}>My Properties</Link>
            )}
            {currentUser ? (
              <Link to="/profile" className="text-white hover:text-[#FFD700] transition-colors" onClick={() => setOpen(false)}>Profile</Link>
            ) : (
              <>
                <Link to="/login" className="text-white hover:text-[#FFD700] transition-colors" onClick={() => setOpen(false)}>Sign in</Link>
                <Link to="/register" className="text-white hover:text-[#FFD700] transition-colors" onClick={() => setOpen(false)}>Sign up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
