import List from "../../components/list/List";
import Bookings from "../../components/bookings/Bookings";
import PropertyBookings from "../../components/propertyBookings/PropertyBookings";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate, useRevalidator } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {
  const data = useLoaderData();
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const revalidator = useRevalidator(); // Used to refresh data after deletion

  const handleLogout = async () => {
    try {
      await apiRequest.post("/api/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await apiRequest.delete(`/posts/${postId}`);
      // Refresh the data to remove the deleted post from the list
      revalidator.revalidate();
    } catch (err) {
      console.log(err);
      alert("Failed to delete property");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d] text-white py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={currentUser.avatar || "/noavatar.jpg"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-[#fece51]"
              />
              <Link
                to="/profile/update"
                className="absolute bottom-0 right-0 w-7 h-7 bg-[#fece51] rounded-full flex items-center justify-center"
              >
                <img src="/edit.png" alt="Edit" className="w-4 h-4" />
              </Link>
            </div>
            <div>
              <h1 className="text-2xl font-playfair font-bold">{currentUser.username}</h1>
              <p className="text-white/70 text-sm">{currentUser.email}</p>
              <p className="text-[#fece51] text-sm">Account Type: {currentUser.userType}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              to="/profile/update"
              className="px-5 py-2.5 bg-white/10 text-white border border-white/20 rounded-lg text-sm font-medium no-underline hover:bg-white/20 transition-colors"
            >
              Edit Profile
            </Link>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-red-600 text-white border-none rounded-lg text-sm font-medium cursor-pointer hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-8">
        {currentUser.userType === "seller" && (
          <>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-playfair font-bold text-[#040404] mb-5">Property Booking Requests</h2>
              <PropertyBookings />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-playfair font-bold text-[#040404]">My Properties</h2>
                <Link
                  to="/add"
                  className="px-4 py-2 bg-[#fece51] text-white text-sm font-medium rounded-lg no-underline hover:bg-[#f0b400] transition-colors"
                >
                  Create New Post
                </Link>
              </div>
              <Suspense fallback={<div className="text-gray-500 text-sm">Loading properties...</div>}>
                <Await
                  resolve={data.postResponse}
                  errorElement={<div className="text-red-500 text-sm">Error loading properties!</div>}
                >
                  {(postResponse) => {
                    const { userPosts } = postResponse.data;
                    return userPosts.length === 0 ? (
                      <div className="text-center py-8 text-gray-400">
                        <p className="mb-4">You haven&apos;t created any properties yet.</p>
                        <Link to="/add" className="px-5 py-2.5 bg-[#fece51] text-white rounded-lg no-underline text-sm">
                          Create Your First Property
                        </Link>
                      </div>
                    ) : (
                      <List posts={userPosts} onDelete={handleDelete} />
                    );
                  }}
                </Await>
              </Suspense>
            </div>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-playfair font-bold text-[#040404] mb-5">Saved Properties</h2>
            <Suspense fallback={<div className="text-gray-500 text-sm">Loading...</div>}>
              <Await
                resolve={data.postResponse}
                errorElement={<div className="text-red-500 text-sm">Error loading posts!</div>}
              >
                {(postResponse) => <List posts={postResponse.data.savedPosts} />}
              </Await>
            </Suspense>
          </div>

          {currentUser.userType === "buyer" && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-playfair font-bold text-[#040404] mb-5">My Bookings</h2>
              <Bookings />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ProfilePage;

