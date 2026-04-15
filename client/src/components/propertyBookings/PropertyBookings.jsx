import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";

function PropertyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 3;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await apiRequest.get("/property-bookings");
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch property bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(bookings.length / pageSize));
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [bookings, page]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const response = await apiRequest.patch(`/property-bookings/${bookingId}/status`, {
        status: newStatus,
      });

      setBookings((currentBookings) =>
        currentBookings.map((booking) =>
          booking.id === bookingId ? response.data : booking
        )
      );
    } catch (err) {
      setError("Failed to update booking status");
    }
  };

  const totalPages = Math.max(1, Math.ceil(bookings.length / pageSize));
  const startIndex = (page - 1) * pageSize;
  const visibleBookings = bookings.slice(startIndex, startIndex + pageSize);

  if (loading) return <p className="text-gray-500 p-4">Loading property bookings...</p>;
  if (error) return <p className="text-red-500 p-4">{error}</p>;

  return (
    <div className="mt-5">
      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 text-base p-5">No upcoming booking requests for your properties yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {visibleBookings.map((booking) => (
            <div key={booking.id} className="bg-gray-50 rounded-lg p-4 flex justify-between items-start">
              <div>
                <h3 className="mb-1 text-lg text-[#333] font-semibold">{booking.post.title}</h3>
                <p className="text-gray-500 mb-2.5">{booking.post.address}</p>
                <p className="text-[#333] font-medium mb-1">Visit Date: {new Date(booking.date).toLocaleString()}</p>
                <p className="text-gray-500 mb-1">Requested by: {booking.user.username}</p>
                <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                  booking.status === 'pending'  ? 'bg-yellow-50 text-yellow-800' :
                  booking.status === 'approved' ? 'bg-green-50 text-green-800' :
                  'bg-red-50 text-red-800'
                }`}>
                  Status: {booking.status}
                </span>
                {booking.status === 'approved' && booking.user.phoneNumber && (
                  <p className="text-gray-500 mt-1">Phone: {booking.user.phoneNumber}</p>
                )}
              </div>
              <div className="flex flex-col gap-2.5">
                <Link to={`/${booking.postId}`}>
                  <button className="px-4 py-2 bg-[#fece51] text-white border-none rounded cursor-pointer font-medium hover:opacity-90 transition-opacity">View Property</button>
                </Link>
                {booking.status === 'pending' && (
                  <div className="flex gap-2.5">
                    <button
                      className="px-4 py-2 bg-green-600 text-white border-none rounded cursor-pointer font-medium hover:opacity-90 transition-opacity"
                      onClick={() => handleStatusUpdate(booking.id, 'approved')}
                    >Approve</button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white border-none rounded cursor-pointer font-medium hover:opacity-90 transition-opacity"
                      onClick={() => handleStatusUpdate(booking.id, 'rejected')}
                    >Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Prev
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PropertyBookings; 
