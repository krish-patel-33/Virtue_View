import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";
import Notification from "../../components/notification/Notification";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const navigate = useNavigate();
  const { currentUser, updateUser, loading } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser && !loading) {
      navigate("/");
    }
  }, [currentUser, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target);
    const { username, email, password, userType } = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/auth/register", {
        username,
        email,
        password,
        userType
      });
      updateUser(res.data.data); // accessing data from the response structure
      setShowNotification(true);
      setNotificationMessage("Registration successful!");
    } catch (err) {
      console.error("Registration failed:", err);
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
      setError(errorMessage);
      setShowNotification(true);
      setNotificationMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none bg-gray-50 focus:border-[#fece51] focus:bg-white transition-colors";

  return (
    <div className="flex h-full">
      <div className="flex-[3] flex items-center justify-center p-10 bg-white">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-[400px]">
          <h1 className="text-3xl font-bold text-[#040404] font-playfair">Create an Account</h1>
          <input name="username" type="text" placeholder="Username" required minLength={3} maxLength={20} className={inputCls} />
          <input name="email" type="email" placeholder="Email" required className={inputCls} />
          <input name="password" type="password" placeholder="Password" required minLength={6} className={inputCls} />
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="userType" value="buyer" defaultChecked className="accent-[#fece51]" />
              <span className="text-sm text-[#333]">Buyer</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="userType" value="seller" className="accent-[#fece51]" />
              <span className="text-sm text-[#333]">Seller</span>
            </label>
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#fece51] to-[#f0b400] text-white font-semibold rounded-lg cursor-pointer border-none hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
          >
            Register
          </button>
          {error && <span className="text-sm text-red-500 text-center">{error}</span>}
          <div className="text-center text-sm text-gray-500">
            <Link to="/login" className="text-[#fece51] font-medium hover:underline">Do you have an account?</Link>
          </div>
        </form>
      </div>
      <div className="flex-[2] hidden md:block overflow-hidden">
        <img src="/bg.png" alt="" className="w-full h-full object-cover" />
      </div>
      {showNotification && (
        <Notification
          message={notificationMessage}
          type={error ? "error" : "success"}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
}

export default Register;
