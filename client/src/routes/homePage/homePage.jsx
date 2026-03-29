import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function HomePage() {
  const { currentUser } = useContext(AuthContext);

  const features = [
    { img: "/search.png", title: "Advanced Search", desc: "Find properties that match your exact criteria with our powerful search filters" },
    { img: "https://cdn-icons-png.flaticon.com/512/684/684908.png", title: "Interactive Maps", desc: "Explore properties in their real-world location with our interactive map view" },
    { img: "/3dview.jpg", title: "3D Model Generation", desc: "Experience properties in immersive 3D with our advanced model generation technology" },
    { img: "/save.png", title: "Save Favorites", desc: "Bookmark your favorite properties to easily access them later" },
  ];

  const values = [
    { num: "01", title: "Transparent Process", desc: "We believe in complete transparency throughout the property transaction process" },
    { num: "02", title: "Verified Listings", desc: "All properties are verified to ensure they meet our quality standards" },
    { num: "03", title: "Expert Support", desc: "Our team of real estate experts is always ready to assist you" },
    { num: "04", title: "Secure Transactions", desc: "Your security is our priority with protected payment and data systems" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div
        className="relative h-[calc(100vh-100px)] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg.png')" }}
      >
        {/* Gradient overlay - richer depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80"></div>

        {/* Subtle gold radial glow behind title */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#fece51]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 text-white text-center flex flex-col items-center gap-5">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#fece51]/15 backdrop-blur-sm border border-[#fece51]/30 px-5 py-2 rounded-full text-sm font-poppins font-medium text-[#fece51] tracking-wide">
            <span className="w-2 h-2 rounded-full bg-[#fece51] animate-pulse"></span>
            Premium Real Estate Platform
          </div>

          {/* Headline */}
          <div>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold leading-tight">
              Find Your{" "}
              <span className="text-[#fece51] relative">
                Dream Home
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 9C50 4 100 2 150 4C200 6 250 5 298 3" stroke="#fece51" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
                </svg>
              </span>
            </h1>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold leading-tight mt-2">
              in the Perfect Location
            </h1>
          </div>

          {/* Subtext */}
          <p className="text-white/70 text-base font-poppins max-w-xl leading-relaxed">
            Search thousands of properties across India — buy or rent with confidence using our smart search.
          </p>

          {/* Search Bar */}
          <div className="w-full">
            <SearchBar />
          </div>
        </div>
      </div>

      {/* Our Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold text-[#040404] mb-3">Our Features</h2>
            <p className="text-gray-500">Discover what makes us the best choice for your real estate needs</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(f => (
              <div key={f.title} className="text-center p-8 rounded-xl bg-gray-50 hover:shadow-lg transition-all hover:-translate-y-1">
                <div className="w-16 h-16 mx-auto mb-4">
                  <img src={f.img} alt={f.title} className="w-full h-full object-contain" />
                </div>
                <h3 className="font-semibold text-[#040404] mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Value Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold text-[#040404] mb-3">Our Value</h2>
            <p className="text-gray-500">Why thousands of people trust us for their real estate needs</p>
          </div>
          <div className="flex gap-12 items-center flex-col md:flex-row">
            <div className="flex-1 rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                alt="Our Value - Modern Real Estate"
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="flex-1 flex flex-col gap-6">
              {values.map(v => (
                <div key={v.num} className="flex gap-4">
                  <div className="text-3xl font-bold text-[#fece51] font-playfair w-12 shrink-0">{v.num}</div>
                  <div>
                    <h3 className="font-semibold text-[#040404] mb-1">{v.title}</h3>
                    <p className="text-gray-500 text-sm">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-[#1a1a1a] text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="Logo" className="h-8" />
                <h3 className="font-playfair font-bold text-lg">Virtuview properties</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">Your trusted partner in finding the perfect property. We connect buyers, sellers, and renters in one place.</p>
              <div className="flex gap-3">
                {['fa-facebook-f','fa-twitter','fa-instagram','fa-linkedin-in'].map(icon => (
                  <a key={icon} href="#" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#fece51] transition-colors">
                    <i className={`fab ${icon} text-sm`}></i>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#fece51]">Quick Links</h4>
              <ul className="flex flex-col gap-2 text-gray-400 text-sm">
                <li><Link to="/" className="hover:text-[#fece51] transition-colors no-underline text-inherit"><i className="fas fa-home mr-2"></i>Home</Link></li>
                <li><Link to="/list" className="hover:text-[#fece51] transition-colors no-underline text-inherit"><i className="fas fa-building mr-2"></i>Properties</Link></li>
                <li><Link to="/about" className="hover:text-[#fece51] transition-colors no-underline text-inherit"><i className="fas fa-info-circle mr-2"></i>About Us</Link></li>
                <li><Link to="/contact" className="hover:text-[#fece51] transition-colors no-underline text-inherit"><i className="fas fa-envelope mr-2"></i>Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-[#fece51]">Contact Us</h4>
              <ul className="flex flex-col gap-3 text-gray-400 text-sm">
                <li className="flex items-start gap-2"><i className="fas fa-map-marker-alt mt-1"></i><span>virtuview properties, City, Country</span></li>
                <li className="flex items-center gap-2"><i className="fas fa-phone-alt"></i><span>+1 234 567 890</span></li>
                <li className="flex items-center gap-2"><i className="fas fa-envelope"></i><span>info@virtuview.com</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} VirtuView Properties. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#fece51] transition-colors"><i className="fas fa-shield-alt mr-1"></i>Privacy Policy</a>
              <a href="#" className="hover:text-[#fece51] transition-colors"><i className="fas fa-file-contract mr-1"></i>Terms of Service</a>
              <a href="#" className="hover:text-[#fece51] transition-colors"><i className="fas fa-cookie mr-1"></i>Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
