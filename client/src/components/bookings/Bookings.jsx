import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await apiRequest.get("/bookings");
        if (response.data && Array.isArray(response.data)) {
          setBookings(response.data);
        } else {
          setError("Invalid response format from server");
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        if (err.response?.status === 401) {
          setError("Please login to view your bookings");
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to fetch bookings. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-5">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#fece51] rounded-full [animation:spin_1s_linear_infinite]"></div>
        <p className="text-gray-500 text-lg">Loading your bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-5">
        <p className="text-red-500 text-lg text-center">{error}</p>
        <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-[#fece51] text-white border-none rounded cursor-pointer font-medium hover:bg-[#e6b847] transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-5">
      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[200px] gap-5 text-center">
          <p className="text-gray-500 text-lg">You have no bookings yet.</p>
          <Link to="/properties" className="px-5 py-2.5 bg-[#fece51] text-white rounded cursor-pointer font-medium no-underline hover:bg-[#e6b847] transition-colors">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 py-5">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-[10px] p-5 shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-all hover:-translate-y-[5px] hover:shadow-[0_5px_15px_rgba(0,0,0,0.2)]"
            >
              <div>
                <h3 className="mb-2.5 text-[#333] text-xl font-semibold">{booking.post?.title || "Property Title Not Available"}</h3>
                <p className="text-gray-500 mb-2.5 text-sm">{booking.post?.address || "Address Not Available"}</p>
                <p className="text-[#333] font-medium mb-2.5">Visit Date: {new Date(booking.date).toLocaleString()}</p>
                <span className={`inline-block px-2.5 py-1 rounded text-sm font-medium ${
                  booking.status === 'pending'  ? 'bg-yellow-50 text-yellow-800' :
                  booking.status === 'approved' ? 'bg-green-50 text-green-800' :
                  'bg-red-50 text-red-800'
                }`}>
                  Status: {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
              <div className="mt-5 flex justify-end">
                {booking.postId && (
                  <Link to={`/${booking.postId}`}>
                    <button className="px-4 py-2 bg-[#fece51] text-white border-none rounded cursor-pointer font-medium hover:bg-[#e6b847] transition-colors">View Property</button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings; 