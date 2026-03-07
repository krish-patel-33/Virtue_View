import PropertyGallery from "../../components/propertyGallery/PropertyGallery";
import Map from "../../components/map/Map";
import ModelViewer from "../../components/modelViewer/ModelViewer";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const res = await apiRequest.post("/users/save", { postId: post.id });
      if (res.data.message === "Post saved") {
        setSaved(true);
        setSaveSuccess(true);
        setTimeout(() => {
          setSaveSuccess(false);
        }, 3000);
      } else if (res.data.message === "Post removed from saved list") {
        setSaved(false);
      }
    } catch (err) {
      console.error("Save error:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setBookingError(err.response?.data?.message || "Failed to save the property");
      }
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (!currentUser.phoneNumber) {
      if (window.confirm("You must add a phone number to book a visit. Go to profile settings?")) {
        navigate("/profile/update");
      }
      return;
    }

    if (!bookingDate) {
      setBookingError("Please select a date for your visit");
      return;
    }

    try {
      const res = await apiRequest.post("/bookings", {
        postId: post.id,
        date: bookingDate,
      });

      if (res.data.message === "Booking created successfully") {
        setBookingSuccess("Booking request sent successfully!");
        setShowBookingForm(false);
        setBookingDate("");
        setBookingError("");
      } else {
        setBookingError(res.data.message || "Failed to book the property");
      }
    } catch (err) {
      console.error("Booking error:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setBookingError(err.response?.data?.message || "Failed to book the property. Please try again later.");
      }
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-100px)]">
      {/* Left scrollable content */}
      <div className="flex-[2] h-[calc(100vh-100px)] overflow-y-auto bg-white">
        <div className="p-6">
          <PropertyGallery images={post.images} />
          <div className="mt-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-playfair font-bold text-[#040404] mb-2">{post.title}</h1>
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <img src="/pin.png" alt="" className="w-4 h-4" />
                  <span>{post.address}</span>
                </div>
                <div className="text-2xl font-bold text-[#fece51]">₹ {post.price}</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <img src={post.user.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                <span className="text-sm text-gray-500">{post.user.username}</span>
              </div>
            </div>
            <div
              className="text-gray-600 leading-relaxed prose max-w-none"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.postDetail.desc) }}
            ></div>
          </div>
        </div>

        {/* Features */}
        <div className="px-6 pb-6">
          <p className="font-semibold text-[#040404] mb-4 text-lg">General</p>
          <div className="flex flex-col gap-4 mb-6">
            {[
              { icon: "/utility.png", label: "Utilities", value: post.postDetail.utilities === "owner" ? "Owner is responsible" : "Tenant is responsible" },
              { icon: "/pet.png", label: "Pet Policy", value: post.postDetail.pet === "allowed" ? "Pets Allowed" : "Pets not Allowed" },
              { icon: "/fee.png", label: "Income Policy", value: post.postDetail.income },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <img src={f.icon} alt="" className="w-8 h-8 object-contain" />
                <div>
                  <span className="text-sm font-medium text-[#040404] block">{f.label}</span>
                  <p className="text-sm text-gray-500">{f.value}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="font-semibold text-[#040404] mb-4 text-lg">Sizes</p>
          <div className="flex gap-4 mb-6">
            {[
              { icon: "/size.png", value: `${post.postDetail.size} sqft` },
              { icon: "/bed.png", value: `${post.bedroom} beds` },
              { icon: "/bath.png", value: `${post.bathroom} bathroom` },
            ].map(s => (
              <div key={s.icon} className="flex items-center gap-2 px-4 py-3 bg-gray-50 rounded-lg">
                <img src={s.icon} alt="" className="w-6 h-6 object-contain" />
                <span className="text-sm text-gray-600">{s.value}</span>
              </div>
            ))}
          </div>

          <p className="font-semibold text-[#040404] mb-4 text-lg">Nearby Places</p>
          <div className="flex gap-4 mb-6 flex-wrap">
            {[
              { icon: "/school.png", label: "School", value: `${post.postDetail.school > 999 ? post.postDetail.school / 1000 + "km" : post.postDetail.school + "m"} away` },
              { icon: "/pet.png", label: "Bus Stop", value: `${post.postDetail.bus}m away` },
              { icon: "/fee.png", label: "Restaurant", value: `${post.postDetail.restaurant}m away` },
            ].map(n => (
              <div key={n.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg flex-1 min-w-[140px]">
                <img src={n.icon} alt="" className="w-8 h-8 object-contain" />
                <div>
                  <span className="text-sm font-medium text-[#040404] block">{n.label}</span>
                  <p className="text-sm text-gray-500">{n.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium border transition-colors ${
                saved ? "bg-[#fece51] text-white border-[#fece51] cursor-default" : "bg-white text-[#040404] border-gray-200 hover:border-[#fece51] cursor-pointer"
              }`}
            >
              <img src="/save.png" alt="" className="w-5 h-5" />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
            {currentUser?.userType !== "seller" && (
              <button
                onClick={() => setShowBookingForm(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-lg font-medium bg-[#fece51] text-white border-none cursor-pointer hover:bg-[#f0b400] transition-colors"
              >
                <img src="https://cdn-icons-png.flaticon.com/512/747/747310.png" alt="Calendar" className="w-5 h-5" />
                Book a Visit
              </button>
            )}
          </div>

          {bookingSuccess && <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">{bookingSuccess}</div>}

          {showBookingForm && (
            <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="font-semibold text-[#040404] mb-4">Book a Visit</h3>
              <form onSubmit={handleBooking} className="flex flex-col gap-4">
                <input
                  type="datetime-local"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  required
                  className="px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#fece51] transition-colors"
                />
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 py-3 bg-[#fece51] text-white font-semibold rounded-lg border-none cursor-pointer hover:bg-[#f0b400] transition-colors">Book Now</button>
                  <button type="button" onClick={() => setShowBookingForm(false)} className="flex-1 py-3 bg-white text-gray-600 font-semibold rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">Cancel</button>
                </div>
                {bookingError && <div className="text-red-500 text-sm">{bookingError}</div>}
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Right sticky panel */}
      <div className="flex-[1.5] sticky top-0 h-[calc(100vh-100px)] bg-[#e8eaed] flex flex-col">
        <div className="p-4 h-[45%]">
          <ModelViewer />
        </div>
        <div className="p-4 flex-1">
          <Map items={[post]} />
        </div>
      </div>

      {saveSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg z-50 text-sm">
          Post saved successfully!
        </div>
      )}
    </div>
  );
}

export default SinglePage;
