import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    const { username, password } = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/auth/login", {
        username,
        password,
      });

      if (res.data) {
        updateUser(res.data);
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none bg-gray-50 focus:border-[#fece51] focus:bg-white transition-colors text-gray-800 placeholder-gray-400";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex-[3] flex items-center justify-center p-10 bg-white">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-[400px]">
          <h1 className="text-3xl font-bold text-[#040404] font-playfair">Welcome back</h1>
          <input name="username" required minLength={3} maxLength={20} type="text" placeholder="Username" className={inputCls} />
          <div className="relative">
            <input 
              name="password" 
              type={showPassword ? "text" : "password"} 
              required 
              placeholder="Password" 
              className={inputCls + " pr-12"} 
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          <button
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[#fece51] to-[#f0b400] text-white font-semibold rounded-lg cursor-pointer border-none hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
          <div className="text-center">
            <Link to="/forgot-password" className="text-xs text-gray-500 hover:text-[#fece51] transition-colors">Forgot Password?</Link>
          </div>
          {error && <span className="text-sm text-red-500 text-center">{error}</span>}
          <div className="text-center text-sm text-gray-500">
            <Link to="/register" className="text-[#fece51] font-medium hover:underline">{"Don't"} you have an account?</Link>
          </div>
        </form>
      </div>
      <div className="flex-[2] hidden md:block overflow-hidden">
        <img src="/bg.png" alt="" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

export default Login;
